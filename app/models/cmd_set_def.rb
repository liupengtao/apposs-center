class CmdSetDef < ActiveRecord::Base
  belongs_to :app

  has_many :cmd_sets

  has_many :cmd_set_def_binds
  has_many :cmd_defs, :through => :cmd_set_def_binds

  def build_command cmd_set
    app_id = app.id
    cmd_set_id = cmd_set.id
    cmd_defs.collect{|cmd_def|
      Command.create(:app_id => app_id, :cmd_def => cmd_def, :cmd_set_id => cmd_set_id)
    }
  end
end