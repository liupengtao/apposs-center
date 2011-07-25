class Admin::CmdDefsController < Admin::BaseController
  def index
    respond_with CmdDef.all
  end

  def show
    respond_with CmdDef.find(params[:id])
  end

  def create
    respond_with CmdDef.create( params[:cmd_def] )
  end

  def update
    respond_with CmdDef.find( params[:id] ).update_attributes( params[:cmd_def] )
  end

  def destroy
    respond_with CmdDef.find(params[:id])
  end
end
