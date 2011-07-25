class CmdSet < ActiveRecord::Base
  belongs_to :cmd_set_def
  
  has_many :commands

  belongs_to :operator, :class_name => 'User'

end
