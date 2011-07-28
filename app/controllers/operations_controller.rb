class OperationsController < BaseController

  def index
    respond_with current_app.cmd_sets.find(params[:cmd_set_id]).commands.find(params[:command_id]).operations
  end
end
