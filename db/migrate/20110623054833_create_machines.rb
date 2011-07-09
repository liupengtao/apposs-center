class CreateMachines < ActiveRecord::Migration
  def self.up
    create_table :machines do |t|
      t.string :name
      t.string :host
      t.integer :room_id
      t.integer :app_id

      t.timestamps
    end
  end

  def self.down
    drop_table :machines
  end
end
