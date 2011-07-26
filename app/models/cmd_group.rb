class CmdGroup < ActiveRecord::Base
  has_many :cmd_defs
  
  has_many :app_binds, :class_name => 'AppCmdGroup'
  has_many :apps, :through => :app_binds
  
  attr_accessor :cmd_def_ids
  
  after_save :update_cmd_defs
  
  def update_cmd_defs
    self.cmd_defs << CmdDef.where(:id => cmd_def_ids.split( ',' ))
  end
  
  def to_s
  	name
  end
end
