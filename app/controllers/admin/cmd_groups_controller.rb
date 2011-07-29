class Admin::CmdGroupsController < Admin::BaseController
  def index
    respond_with CmdGroup.all
  end

  def show
    respond_with CmdGroup.find(params[:id])
  end

  def create
    respond_with CmdGroup.create( params[:cmd_group] )
  end

  def update
    respond_with CmdGroup.find( params[:id] ).update_attributes( params[:cmd_group] )
  end

  def destroy
    respond_with CmdGroup.find(params[:id]).delete
  end
end
