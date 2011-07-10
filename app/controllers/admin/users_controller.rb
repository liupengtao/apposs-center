class Admin::UsersController < Admin::BaseController
  def attributes
  	[:email, :last_sign_in_ip, :last_sign_in_at]
  end
end
