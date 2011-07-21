class CmdSetDef < ActiveRecord::Base
  belongs_to :app

  has_many :cmd_def_binds
  has_many :cmd_defs, :through => :cmd_def_binds
end
