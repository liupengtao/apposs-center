class MachinesController < BaseController

  def index
    respond_with current_app.machines
  end

end
