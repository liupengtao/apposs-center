class ApiController < ApplicationController
  def commands
  	room = Room.find :first, :conditions => {:name => params[:room_name]}
  	# 查询参数包括机房的 name 和 id，是考虑到 room 表的name字段发生变动，
  	# 此时应该谨慎处理，不下发相应的命令
  	render :text => Operation.uncompleted.where(:room_id => room.id, :room_name => room.name).collect{|o|
  		o.download
  		"#{o.machine_host}:#{o.command_name}"
  	}.join("\n")
  end
  
  def callback
  	
  end
end
