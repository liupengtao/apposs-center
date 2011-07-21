class CmdSetDefBind < ActiveRecord::Base
  belongs_to :cmd_set_def
  belongs_to :cmd_def
end