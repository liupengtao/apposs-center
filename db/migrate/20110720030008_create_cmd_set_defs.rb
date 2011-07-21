class CreateCmdSetDefs < ActiveRecord::Migration
  def self.up
    create_table :cmd_set_defs do |t|
      t.string :name
      t.integer :app_id
      t.string :expression

      t.timestamps
    end

    create_table :cmd_set_def_binds, :id => false do |t|
      t.integer :cmd_set_def_id
      t.integer :cmd_def_id
    end
  end

  def self.down
    drop_table :cmd_set_def_binds
    drop_table :cmd_set_defs
  end
end
