class App < ActiveRecord::Base
  # People
  has_many :stakeholders
  has_many :operators, :through => :stakeholders, :class_name => 'User'
  
  # Machine
  has_many :machines

  # Command
  has_many :commands
  
  has_many :cmd_group_binds, :class_name => 'AppCmdGroup'
  has_many :cmd_groups, :through => :cmd_group_binds, :class_name => 'CmdGroup'
 
  has_many :cmd_def_binds, :class_name => 'AppCmdDef'
  has_many :cmd_defs, :through => :cmd_def_binds
  
  has_many :cmd_set_defs
  
  def to_s
  	send :name
  end

  def cmd_sets
    CmdSet.where(:cmd_set_def_id => cmd_set_defs.select(:id).collect{|o| o.id})
  end

  def all_cmd_defs
    CmdDef.where( :id => cmd_groups.all.collect{|cg| cg.id})
  end
end
