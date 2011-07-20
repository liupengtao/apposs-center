class CmdSetsController < BaseController
  def index
    respond_with current_app.cmd_sets
  end
end
