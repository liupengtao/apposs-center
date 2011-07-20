class CreateCmdDefs < ActiveRecord::Migration
  def self.up
    create_table :cmd_defs do |t|
      t.string :name
      t.string :alias
      t.string :arg1
      t.string :arg2
      t.string :arg3
      t.string :arg4
      t.string :arg5
      t.integer :cmd_group_id

      t.timestamps
    end
    
  end

  def self.down
    drop_table :cmd_defs
  end
end
