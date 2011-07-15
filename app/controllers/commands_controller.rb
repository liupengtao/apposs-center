class CommandsController < ApplicationController

  respond_to :js
  
  def new
  	cmd_def = CmdDef.find(params[:def])
  	@command = current_user.apps.find(params[:app_id]).commands.create(:name => cmd_def.name)
  	@command.build_operations
  	respond_with(@command)
  end
end
