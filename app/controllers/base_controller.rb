class BaseController < ApplicationController

  before_filter :authenticate_user!
  
  respond_to :json

  def current_app
    current_user.apps.where(:id => params[:id]).first||App.new
  end
end
