class CmdSetDefsController < BaseController
  def index
    app_id = current_app.id
    respond_with current_app.cmd_set_defs.collect{|obj|
      obj.serializable_hash.update("actions" => [
        {:name=>"执行",:url=> app_cmd_sets_path(app_id), :type => 'simple', :method => 'POST'},
        {:name=>"修改",:url=> edit_app_cmd_set_def_path(app_id,obj.id), :type => 'multi', :method => 'GET'}
      ])
    }
  end
  
  def show
    @cmd_set_def = current_app.cmd_set_defs.find(params[:id])
    render 
  end

  def edit
    @cmd_set_def = current_app.cmd_set_defs.find(params[:id])
    render
  end

  def create
    obj = current_app.cmd_set_defs.create :name => params[:name], :expression => params[:expression]
    respond_with obj
  end
  
  def update
    obj = current_app.cmd_set_defs.find(params[:id])
    p obj
    obj.update_attributes :name => params[:name], :expression => params[:expression]
    respond_with obj
  end
  
  def destroy
    respond_with current_app.cmd_set_defs.find(params[:id])
  end
end
