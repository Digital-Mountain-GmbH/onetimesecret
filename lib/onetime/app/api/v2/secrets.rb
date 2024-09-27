

require_relative 'base'
require_relative '../../app_settings'
require_relative '../../../logic/secrets'

class Onetime::App::APIV2
  class Secrets
    include Onetime::App::AppSettings
    include Onetime::App::APIV2::Base

    @check_utf8 = true
    @check_uri_encoding = true

    def burn_secrets
      process_action(
        OT::Logic::Secrets::BurnSecret,
        "Secret burned successfully.",
        "Secret could not be removed.",
        allow_anonymous: true
      )
    end

    def get_metadata
      retrieve_records(OT::Logic::Secrets::ShowMetadata, allow_anonymous: true)
    end

    def get_secret
      retrieve_records(OT::Logic::Secrets::ShowSecret, allow_anonymous: true)
    end

    def list_metadata
      retrieve_records(OT::Logic::Secrets::ShowMetadataList)
    end

  end
end
