class MachinesController < InheritedResources::Base
  actions :show
  
  def attributes
  	[[:name], [:room]]
  end
end
