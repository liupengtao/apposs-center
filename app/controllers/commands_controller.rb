class CommandsController < ApplicationController

  def new
  	command_def = CommandDef.find(params[:def])
  	current_user.apps.find(params[:app_id]).commands.create(:name => command_def.name)
  	# TODO 分配、分解命令，完成操作闭环	
  end
end
