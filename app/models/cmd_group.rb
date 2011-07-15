class CmdGroup < ActiveRecord::Base
  has_many :cmd_defs
  
  has_many :app_binds, :class_name => 'AppCmdGroup'
  has_many :apps, :through => :app_binds
  
  def to_s
  	name
  end
end
