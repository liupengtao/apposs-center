class HomeController < ApplicationController

	respond_to :json, :except => [:index]

  def index
  	render :layout => 'application'
  end

	def welcome
    respond_with current_user
	end
end
