class MachinesController < InheritedResources::Base
  actions :all, :except => [ :edit, :update, :destroy, :new ]
  
  def attributes
  	[[:name], [:room]]
  end
end
