class Admin::RolesController < InheritedResources::Base
  before_filter :authenticate_user!
end
