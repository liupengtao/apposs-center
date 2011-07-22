class CmdSet < ActiveRecord::Base
  belongs_to :cmd_set_def
  
  has_many :commands

  belongs_to :user, :foreign_key => 'owner_id'
  
  def after_save
    app_id = cmd_set_def.app.id # 出于性能考虑缓存 id
    cmd_set_def.cmd_defs.collect{|cmd_def|
      Command.create(:app_id => app_id, :cmd_def => cmd_def, :cmd_set_id => id)
    }
  end
end
