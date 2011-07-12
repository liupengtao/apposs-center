class Profile < ActiveRecord::Base
  has_many :command_defs
  
  has_many :apps
  
  def to_s
  	name
  end
end
