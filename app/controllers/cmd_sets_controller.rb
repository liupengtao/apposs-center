class CmdSetsController < BaseController
  def index
    respond_with current_app.cmd_sets
  end
  
  def create
    cmd_set = current_app.cmd_set_defs.find(params[:cmd_set_def_id]).create_cmd_set(current_user)
    render :text => cmd_set.to_json
  end
  
  def show
    render :json => current_app.cmd_sets.find(params[:id]).to_json(:include => [:commands])
  end
end
