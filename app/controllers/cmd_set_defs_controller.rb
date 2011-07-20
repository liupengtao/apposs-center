class CmdSetDefsController < BaseController
  def index
    app_id = current_app.id
    respond_with current_app.cmd_set_defs.collect{|obj|
      obj.serializable_hash.update("actions" => [
        {:name=>"执行",:url=> cmd_set_def_cmd_sets_path(obj.id), :type => 'simple', :method => 'POST'},
        {:name=>"修改",:url=> app_cmd_set_def_path(app_id,obj.id), :type => 'multi', :method => 'PUT'}
      ])
    }
  end
end
