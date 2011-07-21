class CommandsController < BaseController

  def index
    respond_with current_app.commands
  end
end
