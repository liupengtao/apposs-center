class AppsController < BaseController

  def index
    respond_with current_user.apps
  end

  def show
    respond_with current_user.apps.find(params[:id])
  end

  def cmd_sets
    respond_with current_app.cmd_sets
  end
end
