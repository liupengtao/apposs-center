class CreateCmdGroups < ActiveRecord::Migration
  def self.up
    create_table :cmd_groups do |t|
      t.string :name

      t.timestamps
    end

    create_table :app_cmd_groups, :id => false do |t|
      t.integer :app_id
      t.integer :cmd_group_id

      t.timestamps
    end
  end

  def self.down
    drop_table :cmd_groups
    drop_table :app_cmd_groups
  end
end
