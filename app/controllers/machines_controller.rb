class MachinesController < InheritedResources::Base

  def index
    respond_with current_app.machines
  end

end
