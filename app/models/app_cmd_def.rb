class AppCmdDef < ActiveRecord::Base
  belongs_to :app
  belongs_to :cmd_def
end
