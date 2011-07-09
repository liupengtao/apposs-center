class HomeController < ApplicationController
  def index
  end

  def app
    @app = current_user.apps.where :id => params[:id]
  end
end
