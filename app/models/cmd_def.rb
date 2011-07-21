class CmdDef < ActiveRecord::Base
  belongs_to :cmd_group

  has_many :cmd_def_binds
  has_many :cmd_set_defs, :through => :cmd_def_binds
end
