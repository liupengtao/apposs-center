class Profile < ActiveRecord::Base
  has_many :command_defs
  
  has_many :apps
end
