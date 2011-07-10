class Admin::UsersController < Admin::BaseController
  before_filter :authenticate_user!
  
  def attributes
  	[:email, :last_sign_in_ip, :last_sign_in_at]
  end
end
