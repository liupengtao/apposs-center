class HomeController < ApplicationController
  before_filter :authenticate_user! , :except => [:index]
  
  def index
  end

  def app
    @app = current_user.apps.find params[:id]
  end
  
end
