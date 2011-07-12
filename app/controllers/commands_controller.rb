class CommandsController < ApplicationController

  respond_to :js
  
  def new
  	command_def = CommandDef.find(params[:def])
  	@command = current_user.apps.find(params[:app_id]).commands.create(:name => command_def.name)
  	@command.build_operations
  	respond_with(@command)
  end
end
