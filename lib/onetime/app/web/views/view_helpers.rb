# frozen_string_literal: true

module Onetime
  module App
    module Views
      module ViewHelpers # rubocop:disable Style/Documentation

        def jsvar(name, value)
          value = case value.class.to_s
                  when 'String', 'Gibbler::Digest', 'Symbol', 'Integer', 'Float'
                    if value.to_s.match?(/\A(https?):\/\/[^\s\/$.?#].[^\s]*\z/)
                      "'#{value}'" # escaping URLs really kills the vibe
                    else
                      "'#{Rack::Utils.escape_html(value)}'"
                    end
                  when 'Array', 'Hash'
                    value.to_json
                  when 'NilClass'
                    'null'
                  when 'Boolean', 'FalseClass', 'TrueClass'
                    value
                  else
                    "console.error('#{value.class} is an unhandled type (named #{name})')"
                  end
          { name: name, value: value }
        end

        def vite_assets
          manifest_path = File.join(PUBLIC_DIR, 'dist', '.vite', 'manifest.json')
          unless File.exist?(manifest_path)
            OT.le "Vite manifest not found at #{manifest_path}. Run `pnpm run build`"
            return '<script>console.warn("Vite manifest not found. Run `pnpm run build`")</script>'
          end

          @manifest_cache ||= JSON.parse(File.read(manifest_path))

          assets = []

          # Find the main entry point (assuming it's named "main.ts" in your manifest)
          main_entry = @manifest_cache["main.ts"]

          if main_entry
            # Add the main JavaScript file
            assets << %(<script type="module" src="/dist/#{main_entry['file']}"></script>)

            # Add the main CSS file if it exists
            if main_entry['css'] && main_entry['css'].first
              assets << %(    <link rel="stylesheet" href="/dist/#{main_entry['css'].first}">)
            end

            # Add preloads for font files
            font_files = @manifest_cache.values.select { |v| v['file'] =~ /\.(woff2?|ttf|otf|eot)$/ }
            font_files.each do |font|
              file_extension = File.extname(font['file']).delete('.')
              assets << %(    <link rel="preload" href="/dist/#{font['file']}" as="font" type="font/#{file_extension}" crossorigin>)
            end
          else
            OT.le "Main entry point not found in Vite manifest at #{manifest_path}"
            return '<script>console.warn("Main entry point not found in Vite manifest")</script>'
          end

          if assets.empty?
            OT.le "No assets found for main entry point in Vite manifest at #{manifest_path}"
            return '<script>console.warn("No assets found for main entry point in Vite manifest")</script>'
          end

          assets.join("\n")
        end

      end
    end
  end
end
