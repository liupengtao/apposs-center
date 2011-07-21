class Command < ActiveRecord::Base
  belongs_to :operator, :class_name => 'User'
  belongs_to :app
  belongs_to :cmd_set
  belongs_to :cmd_def
  has_many :options
  has_many :operations
  has_many :related_machines, :through => :operations, :class_name => 'Machine'
  
  def build_operations
  	machines = app.machines.select([:id,:host,:room_id]).all
  	room_ids = machines.collect{|m| m.room_id }.uniq
  	room_map = Room.where(:id => room_ids).inject({}){|map,room| map.update(room.id => room.name)}
  	machines.collect{|m| 
      Operation.create(
      	:machine_id => m.id,
      	:command => self,
      	:room_id => m.room_id,
      	:machine_host => m.host,
      	:command_name => name,
      	:room_name => room_map[m.room_id]
      )
    }
  end
end
