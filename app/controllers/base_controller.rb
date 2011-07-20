class BaseController < ApplicationController

  before_filter :authenticate_user!
  
  respond_to :xml

  def current_app
    App.where(:id => 1).first||App.new
  end
end
