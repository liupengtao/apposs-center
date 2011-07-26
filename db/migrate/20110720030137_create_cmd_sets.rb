class CreateCmdSets < ActiveRecord::Migration
  def self.up
    create_table :cmd_sets do |t|
      t.integer :cmd_set_def_id
      t.integer :operator_id
      t.integer :app_id
      t.string :name
      t.integer :status

      t.timestamps
    end
  end

  def self.down
    drop_table :cmd_sets
  end
end
