class Command < ActiveRecord::Base
  belongs_to :cmd_set
  belongs_to :cmd_def
  has_many :options
  has_many :operations
  
  before_create do |command|
    self.name = cmd_def.name
  end

  def build_operations!
    # 为循环缓存变量
    cmd_set_def = cmd_set.cmd_set_def
  	machines = cmd_set_def.app.machines.select([:id,:host,:room_id]).all
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
      	:command_name => name,
      	:room_name => room_map[m.room_id],
      	:next_when_fail => next_when_fail
      )
    }
    self
  end
  
  state_machine :state, :initial => :ready do
    event :invoke do transition :ready => :running end
    event :failure do transition :running => :fail end
    event :acknowledge do transition :fail => :done end
    event :ack do transition :fail => :done end
    event :success do transition :running => :done end
  end

end
