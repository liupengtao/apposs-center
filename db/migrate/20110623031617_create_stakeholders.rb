class CreateStakeholders < ActiveRecord::Migration
  def self.up
    create_table :stakeholders do |t|
      t.integer :role_id
      t.integer :user_id

      t.timestamps
    end
  end

  def self.down
    drop_table :stakeholders
  end
end
