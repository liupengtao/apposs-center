class CreateOperations < ActiveRecord::Migration
  def self.up
    create_table :operations do |t|
      t.integer :command_id
      t.integer :machine_id
      t.boolean :next_when_fail
      t.string :state
      t.boolean :isok, :default => false
      t.text :response

      # 冗余字段
      t.integer :room_id
      t.string :room_name
      t.string :machine_host
      t.string :command_name

      # 时间戳
      t.timestamps
    end
    add_index :operations, ["machine_id"], :name => "index_operations_on_machine_id"
    add_index :operations, ["state"], :name => "index_operations_on_state"
  end

  def self.down
    change_table(:operations) do |t|
      t.remove_index :index_operations_on_machine_id
      t.remove_index :index_operations_on_status
    end
    drop_table :operations
  end
end
