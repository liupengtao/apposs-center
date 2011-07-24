class Command < ActiveRecord::Base
  belongs_to :cmd_set
  belongs_to :cmd_def
  has_many :options
  has_many :operations

  def after_create
    # 为循环缓存变量
  	machines = cmd_set.app.machines.select([:id,:host,:room_id]).all
    command_name = cmd_set.name
  	room_map = Room.
        where(:id => machines.collect{|m| m.room_id }.uniq).
        inject({}){|map,room| map.update(room.id => room.name)}
    # 循环创建 operation 对象
  	machines.collect{|m| 
      Operation.create(
      	:machine_id => m.id,
      	:command_id => self.id,
      	:room_id => m.room_id,
      	:machine_host => m.host,
      	:command_name => command_name,
      	:room_name => room_map[m.room_id],
      	:next_when_fail => next_when_fail
      )
    }
  end
end
