class Admin::AppsController < Admin::BaseController
  
  def update_resource(object, attributes)
    attributes[:machines] = Machine.where(:id => attributes[:machines])
    attributes[:cmd_groups] = CmdGroup.where(:id => attributes[:cmd_groups])
    object.update_attributes(attributes)
  end

end
