class Admin::RolesController < Admin::BaseController
  before_filter :authenticate_user!
end
