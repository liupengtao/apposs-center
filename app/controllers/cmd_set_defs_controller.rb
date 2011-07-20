class CmdSetDefsController < BaseController
  def index
    respond_with current_app.cmd_set_defs
  end
end
