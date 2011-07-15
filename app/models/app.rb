class App < ActiveRecord::Base
  has_many :stakeholders
  has_many :operators, :through => :stakeholders, :class_name => 'User'
  has_many :machines
  has_many :commands
  
  has_many :cmd_group_binds, :class_name => 'AppCmdGroup'
  has_many :cmd_groups, :through => :cmd_group_binds, :class_name => 'CmdGroup'
 
  has_many :cmd_def_binds, :class_name => 'AppCmdDef'
  has_many :cmd_defs, :through => :cmd_def_binds
  
  def to_s
  	send :name
  end

  def all_cmd_defs
    CmdDef.where( :id => cmd_groups.all.collect{|cg| cg.id})
  end
end
