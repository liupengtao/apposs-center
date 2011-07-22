class CreateCommands < ActiveRecord::Migration
  def self.up
    create_table :commands do |t|
      t.integer :cmd_def_id
      t.integer :cmd_set_id
      t.boolean :next_when_fail
      t.timestamps
    end
  end

  def self.down
    drop_table :commands
  end
end
