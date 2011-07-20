class CreateCmdSets < ActiveRecord::Migration
  def self.up
    create_table :cmd_sets do |t|
      t.integer :cmd_set_def_id

      t.timestamps
    end
  end

  def self.down
    drop_table :cmd_sets
  end
end
