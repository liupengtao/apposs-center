class ApiController < ApplicationController
  def commands
  	room = Room.where(:name => params[:room_name]).first
  	# 查询参数包括机房的 name 和 id，是考虑到 room 表的name字段发生变动，
  	# 此时应该谨慎处理，不下发相应的命令
  	render :text => Operation.inits.where(:room_id => room.id, :room_name => room.name).collect{|o|
  		o.download
  		"#{o.machine_host}:#{o.command_name}:#{o.id}"
  	}.join("\n")
  end
  
  #{host,Host},{oid,OperationId}
  def run
    Operation.where(:id => params[:oid]).first.run
    render :text => 'ok'
  end
  
  # {isok,atom_to_list(IsOk)},{host,Host},{oid,OperationId},{body,Body}
  def callback
    Operation.where(:id => params[:oid]).first.complete(
        "true"==params[:isok], params[:body]
    )
  	render :text => 'ok'
  end
end
