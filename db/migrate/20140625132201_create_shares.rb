class CreateShares < ActiveRecord::Migration
  def change
    create_table :shares do |t|
      t.references :user, index: true
      t.references :item, index: true, null: false
      t.boolean :can_edit, null: false

      t.timestamps
    end

    add_column :items, :url, :string, length: 43
    add_index :items, :url, unique: true
  end
end
