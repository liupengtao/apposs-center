class AppsController < BaseController

  def index
    respond_with current_user.apps
  end

  def show
    respond_with current_app
  end

  def cmd_defs
    respond_with current_app.cmd_defs
  end
  
  def cmd_sets
    respond_with current_app.cmd_sets
  end
end
