class AppsController < ApplicationController
  def index
    render(:json => current_user.apps)
  end

  def show
    render(:json =>App.find(params[:id]))
  end

  def cmd_def_list
    render :json => App.find(params[:app_id]).cmd_defs
  end
end
