class CreateCommandDefs < ActiveRecord::Migration
  def self.up
    create_table :command_defs do |t|
      t.string :name
      t.string :alias
      t.string :arg1
      t.string :arg2
      t.string :arg3
      t.string :arg4
      t.string :arg5
      t.integer :profile_id

      t.timestamps
    end
  end

  def self.down
    drop_table :command_defs
  end
end
