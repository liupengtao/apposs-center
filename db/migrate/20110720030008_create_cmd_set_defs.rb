class CreateCmdSetDefs < ActiveRecord::Migration
  def self.up
    create_table :cmd_set_defs do |t|
      t.string :name
      t.integer :app_id
      t.string :expression

      t.timestamps
    end
  end

  def self.down
    drop_table :cmd_set_defs
  end
end
