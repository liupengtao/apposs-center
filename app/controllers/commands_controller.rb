class CommandsController < BaseController

  respond_to :js
  
  def new
  	cmd_def = CmdDef.find(params[:def])
  	@command = current_user.apps.find(params[:app_id]).commands.create(:name => cmd_def.name)
  	@command.build_operations
  	respond_with(@command)
  end
  
  def index
    respond_with current_app.commands
  end
end
