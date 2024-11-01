# frozen_string_literal: true

# Rackup Configuration
#
# Usage:
#
#     $ thin -e dev -R config.ru -p 3000 start
#

# Environment Variables
ENV['RACK_ENV'] ||= 'production'
ENV['APP_ROOT'] = File.expand_path(__dir__).freeze
app_root = ENV['APP_ROOT']

# Directory Constants
unless defined?(PUBLIC_DIR)
  PUBLIC_DIR = File.join(app_root, '/public/web').freeze
  APP_DIR = File.join(app_root, '/lib/onetime/app').freeze
end

# Load Paths
$LOAD_PATH.unshift(File.join(app_root, 'lib'))

# Freshly installed operating systems don't always have their locale settings
# figured out. By setting this to UTF-8, we ensure that:
# - All file I/O operations default to UTF-8 encoding.
# - Network I/O operations treat data as UTF-8 encoded.
# - Standard input/output (STDIN, STDOUT, STDERR) uses UTF-8 encoding.
# - Strings created from external sources default to UTF-8 encoding.
# This helps maintain consistency and reduces encoding-related issues.
Encoding.default_external = Encoding::UTF_8

# Required Libraries
require 'rack/content_length'
require 'rack/contrib'
require_relative 'lib/middleware'
require_relative 'lib/onetime'
require_relative 'lib/onetime/middleware/domain_type'

# Boot Application
Onetime.boot! :app

# Rack Applications Configuration
apps = {
  '/api/v1' => '/api/v1/routes',
  '/api/v2' => '/api/v2/routes',
  '/'       => '/web/routes'
}.transform_values { |path| Otto.new(File.join(APP_DIR, path)) }

# JSON Response Headers
headers = { 'Content-Type' => 'application/json' }

# API Error Responses
apps["/api/v1"].not_found = [404, headers, [{ error: 'Not Found' }.to_json]]
apps["/api/v1"].server_error = [500, headers, [{ error: 'Internal Server Error' }.to_json]]
apps["/api/v2"].not_found = [404, headers, [{ message: 'Not Found' }.to_json]]
apps["/api/v2"].server_error = [500, headers, [{ message: 'Internal Server Error' }.to_json]]

# Public Directory for Root Endpoint
apps['/'].option[:public] = PUBLIC_DIR

# Common Middleware
common_middleware = [
  Rack::Lint,
  Rack::CommonLogger,
  Rack::ClearSessionMessages,
  Rack::HandleInvalidUTF8,
  Rack::HandleInvalidPercentEncoding,
  Rack::ContentLength,
  Rack::DetectHost,    # Must come before DomainStrategy
  Onetime::DomainStrategy  # Added after DetectHost
]

# Apply common middleware to all apps
common_middleware.each { |middleware|
  OT.li "[config.ru] Using #{middleware}"
  use middleware
}

if Otto.env?(:dev) && !OT.conf.dig(:experimental, :freeze_app)
  use Rack::Reloader, 1
else
  OT.li "[experimental] Freezing app by request (env: #{ENV['RACK_ENV']})"
  freeze_app
end

# Mount Applications
map '/api/v2' do
  use Rack::JSONBodyParser
  run apps['/api/v2']
end

map '/api/v1' do
  run apps['/api/v1']
end

map '/' do
  run apps['/']
end
