# frozen_string_literal: true

require 'pry'
require_relative '../lib/onetime'

# Use the default config file for tests
OT::Config.path = File.join(__dir__, '..', 'etc', 'config.test')
OT.boot! :cli

## Finds a config path
relative_path = Onetime::Config.path.gsub("#{__dir__}/", '')
relative_path
#=> "../etc/config.test"

## Can load config
@config = Onetime::Config.load
@config.class
#=> Hash

## Has basic config
[@config[:site].class, @config[:redis].class]
#=> [Hash, Hash]

## OT.boot!
OT.boot! :tryouts
[OT.mode, OT.conf.class]
#=> [:tryouts, Hash]

## Has global secret
Onetime.global_secret.nil?
#=> false

## Has default global secret
Onetime.global_secret
#=> 'SuP0r_53cRU7'

## Sets the Truemail verifier email address
Truemail.configuration.verifier_email.nil?
#=> false

## Sets the Truemail verifier email address to the default from address
Truemail.configuration.verifier_email
#=> 'changeme@example.com'

## Truemail knows an invalid email address
Truemail.valid?(Onetime.global_secret)
#=> false

## Truemail knows a valid email address
validator = Truemail.validate('test@onetimesecret.com', with: :regex)
validator.result.valid?
#=> true

## Truemail knows another invalid email address
validator = Truemail.validate('-_test@onetimesecret.com', with: :regex)
validator.result.valid?
#=> false

## Truemail knows yet another invalid email address
validator = Truemail.validate('test@onetimesecret.c.n', with: :regex)
validator.result.valid?
#=> false
