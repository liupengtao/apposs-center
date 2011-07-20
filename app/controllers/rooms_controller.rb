class RoomsController < InheritedResources::Base
  actions :all, :except => [:edit, :update, :destroy, :new]

  def show
    render :json => resource
  end

  def attributes
    [:name]
  end
end
