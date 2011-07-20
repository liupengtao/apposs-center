class BaseController < ApplicationController

  before_filter :authenticate_user!
  
  respond_to :json

  def current_app
    App.where(:id => 1).first||App.new
  end
end
