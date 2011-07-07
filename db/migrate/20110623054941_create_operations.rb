class CreateOperations < ActiveRecord::Migration
  def self.up
    create_table :operations do |t|
      t.integer :command_id
      t.integer :machine_id

      t.timestamps
    end
  end

  def self.down
    drop_table :operations
  end
end
