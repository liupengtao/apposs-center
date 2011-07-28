class CommandsController < BaseController

  def index
    respond_with current_app.cmd_sets.find(params[:cmd_set_id]).commands
  end
end
