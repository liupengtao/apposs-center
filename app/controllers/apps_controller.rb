class AppsController < InheritedResources::Base
  
  before_filter :authenticate_user!

  actions :all, :except => [ :edit, :update, :destroy, :new ]

  protected
    def collection
      @apps ||= end_of_association_chain.paginate(:page => params[:page])
    end
end
