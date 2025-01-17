# lib/onetime/middleware/domain_strategy.rb

require 'public_suffix'

module Onetime
  # Middleware for handling and validating domain types in incoming requests.
  #
  # This class normalizes the incoming host, determines its state (canonical, subdomain,
  # custom, or invalid), and updates the Rack environment with the domain strategy.
  #
  #        :canonical    # Matches configured domain exactly
  #        :subdomain    # Valid subdomain of canonical domain
  #        :custom       # Different valid domain
  #        :invalid      # Invalid/malformed domain
  #
  # As middleware, this class won't halt the request, but will log a detailed error
  # if something unexpected happens.
  #
  class DomainStrategy
    @canonical_domain = nil
    @domains_enabled = nil
    @canonical_domain_parsed = nil

    unless defined?(MAX_SUBDOMAIN_DEPTH)
      MAX_SUBDOMAIN_DEPTH = 10 # e.g., a.b.c.d.e.f.g.h.i.j.example.com
      MAX_TOTAL_LENGTH = 253   # RFC 1034 section 3.1
    end

    # Initializes the DomainStrategy middleware.
    #
    # @param app [Object] The Rack application.
    def initialize(app)
      @app = app
      site_config = OT.conf.fetch(:site, {})
      self.class.initialize_from_config(site_config)
      OT.info "[DomainStrategy]: canonical_domain=#{canonical_domain} enabled=#{domains_enabled?}"
    end

    # Processes the incoming request and updates the Rack environment with the domain strategy.
    #
    # @param env [Hash] The Rack environment.
    # @return [Array] The Rack response.
    def call(env)
      display_domain = canonical_domain
      domain_strategy = :canonical

      if domains_enabled?
        display_domain = env[Rack::DetectHost.result_field_name]
        domain_strategy = Chooserator.choose_strategy(display_domain, canonical_domain_parsed)
      end

      env['onetime.display_domain'] = display_domain
      env['onetime.domain_strategy'] = domain_strategy || :invalid # make sure never nil

      OT.ld "[DomainStrategy]: host=#{display_domain.inspect} strategy=#{domain_strategy}"

      @app.call(env)
    end

    def canonical_domain
      self.class.canonical_domain # string or nil if not configured
    end

    def domains_enabled?
      self.class.domains_enabled # boolean
    end

    def canonical_domain_parsed
      self.class.canonical_domain_parsed
    end

    module Chooserator
      class << self

        # @param request_domain [String] The domain associated to the current request
        # @param canonical_domain [PublicSuffix::Domain, String] The canonical domain.
        def choose_strategy(request_domain, canonical_domain)
          canonical_domain = Parser.parse(canonical_domain) unless canonical_domain.is_a?(PublicSuffix::Domain)
          request_domain = Parser.parse(request_domain)

          case request_domain
          when ->(d) { equal_to?(d, canonical_domain) }    then :canonical
          when ->(d) { peer_of?(d, canonical_domain) }     then :canonical
          when ->(d) { subdomain_of?(d, canonical_domain)} then :subdomain
          when ->(d) { known_custom_domain?(d.domain)}     then :custom
          else
            nil
          end

        rescue PublicSuffix::DomainInvalid => e
          OT.ld "[DomainStrategy]: Invalid domain #{request_domain} #{e.message}"
          nil
        rescue => e
          OT.le "[DomainStrategy]: Unhandled error: #{e.message} (backtrace: " \
                "#{e.backtrace[0..2].join("\n")}) (args: #{request_domain.inspect}, " \
                "#{canonical_domain.inspect})"
          nil
        end

        def equal_to?(left, right)
          return false unless left.domain? && right.domain?

          left.name.eql?(right.name) || left.domain.eql?(right.domain) && left.trd.eql?('www')
        end
        # equal_to?('Example.com', 'example.com') # => true
        # equal_to?('sub.EXAMPLE.COM', 'sub.example.com') # => true
        # equal_to?('example.com', 'different.com') # => false
        # equal_to?('', 'example.com') # => false
        # equal_to?(nil, 'example.com') # => false

        def peer_of?(left, right)
          return false unless left.subdomain? && right.subdomain?
          # NOTE: We do not re-check if the domains are the same
          left.domain.eql?(right.domain)
        end
        # peer_of?('blog.example.com', 'shop.example.com') # => true
        # peer_of?('sub.blog.example.com', 'sub.shop.example.com') # => true
        # peer_of?('blog.example.com', 'example.com') # => false
        # peer_of?('blog.example.com', 'blog.other.com') # => false
        # peer_of?('example.com', 'example.com') # => false

        def subdomain_of?(left, right)
          return false unless left.subdomain? && !right.subdomain?
          return false if left.subdomain.nil?
          left.domain.eql?(right.name)
        end
        # subdomain_of?('sub.example.com', 'example.com') # => true
        # subdomain_of?('other.com', 'example.com') # => false
        # subdomain_of?('deep.sub.example.com', 'example.com') # => true
        # subdomain_of?('example.com', 'example.com') # => false

        def known_custom_domain?(potential_custom_domain)
          !OT::CustomDomain.from_display_domain(potential_custom_domain).nil?
        end

      end
    end

    module Parser
      class << self
        # @raises [PublicSuffix::DomainInvalid]
        # @return [PublicSuffix::Domain]
        def parse(host)
          host = host.to_s.split(':').first # remove port (e.g. localhost:3000)
          raise PublicSuffix::DomainInvalid.new("Cannot parse host") unless basically_valid?(host)
          PublicSuffix.parse(host, default_rule: nil, ignore_private: false) # calls normalize
        end

        def basically_valid?(input)
          return false if input.to_s.empty?
          return false if input.length > MAX_TOTAL_LENGTH

          # Only alphanumeric, dots, and hyphens are valid in domain names
          return false unless input.to_s.match?(/\A[a-zA-Z0-9.-]+\z/)

          segments = input.to_s.split('.').reject(&:empty?)
          return false if segments.length > MAX_SUBDOMAIN_DEPTH

          true
        end

      end
    end

    module ClassMethods
      attr_reader :canonical_domain
      attr_reader :domains_enabled
      attr_reader :canonical_domain_parsed

      alias :domains_enabled? :domains_enabled

      # Sets class instance variables based on the site configuration.
      def initialize_from_config(config)
        raise ArgumentError, "Configuration cannot be nil" if config.nil?

        OT.le "[DomainStrategy]: Initializing from config1: #{@domains_enabled} "
        @domains_enabled = config.dig(:domains, :enabled) || false
        @canonical_domain = get_canonical_domain(config)
        OT.le "[DomainStrategy]: Initializing from config2: #{@domains_enabled} "

        # We don't need to get into any domain parsing if domains are disabled
        return unless domains_enabled?

        @canonical_domain_parsed = Parser.parse(canonical_domain)
      rescue PublicSuffix::DomainInvalid => e
        OT.le "[DomainStrategy]: Invalid canonical domain: #{@canonical_domain.inspect} error=#{e.message}"
        @domains_enabled = false
      end

      # The canonical domain is the configured default domain or the site host.
      # @return [String, nil] The canonical domain or nil
      def get_canonical_domain(config)
        p [:get_canonical_domain, config.dig(:domains, :default), config.dig(:domains, :enabled) || false, @domains_enabled ]
        default_domain = @domains_enabled ? config.dig(:domains, :default) : nil
        site_host = config.fetch(:host, nil)
        default_domain || site_host
      end

      def reset!
        @canonical_domain = nil
        @domains_enabled = nil
        @canonical_domain_parsed = nil
      end
    end

    extend ClassMethods
  end
end
