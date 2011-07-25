class Admin::BaseController < ApplicationController
  before_filter :authenticate_user!

  respond_to :json
  layout 'admin'
end
