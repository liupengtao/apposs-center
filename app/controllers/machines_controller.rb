class MachinesController < InheritedResources::Base
  actions :show
  def index
    render :json => App.find(params[:app_id].to_i).machines
  end
  def attributes
  	[[:name], [:room]]
  end
end
