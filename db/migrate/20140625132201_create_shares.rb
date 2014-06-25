class CreateShares < ActiveRecord::Migration
  def change
    create_table :shares do |t|
      t.references :user, index: true
      t.references :item, index: true, null: false
      t.string :url, length: 32, null: false
      t.boolean :can_edit, null: false

      t.timestamps
    end
    
    add_index :shares, :url, unique: true
  end
end
