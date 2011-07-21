class CmdSet < ActiveRecord::Base
  belongs_to :cmd_set_def
  
  has_many :commands
  
  def build_command
    cmd_set_def.build_command self
  end
end
