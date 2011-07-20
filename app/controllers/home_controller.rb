class HomeController < BaseController

  def index
  	render :layout => 'application'
  end

	def welcome
    respond_with current_user
	end
end
