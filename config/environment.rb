# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
LastfmMashup::Application.initialize!

AKEY = YAML.load_file("#{Rails.root}/config/api_key.yaml")