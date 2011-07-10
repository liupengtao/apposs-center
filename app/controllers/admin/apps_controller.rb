class Admin::AppsController < Admin::BaseController
  
  def update_resource(object, attributes)
    attributes[:machines] = Machine.where(:id => attributes[:machines])
    object.update_attributes(attributes)
  end

end
