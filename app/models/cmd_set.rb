class CmdSet < ActiveRecord::Base
  belongs_to :cmd_set_def
  
  has_many :commands

  belongs_to :operator, :class_name => 'User'
  
  def after_create
    cmd_set_def.build_commands self.id
  end
end
