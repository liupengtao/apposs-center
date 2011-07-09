class Admin::AppsController < InheritedResources::Base
  before_filter :authenticate_user!
  
  def update_resource(object, attributes)
    attributes[:machines] = Machine.where(:id => attributes[:machines])
    object.update_attributes(attributes)
  end

end
