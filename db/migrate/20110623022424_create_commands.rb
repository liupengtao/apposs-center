class CreateCommands < ActiveRecord::Migration
  def self.up
    create_table :commands do |t|
      t.string :name
      t.integer :operator_id
      t.integer :app_id
      t.integer :cmd_def_id
      t.integer :cmd_set_id
      t.timestamps
    end
  end

  def self.down
    drop_table :commands
  end
end
