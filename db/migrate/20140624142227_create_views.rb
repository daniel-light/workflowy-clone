class CreateViews < ActiveRecord::Migration
  def change
    create_table :views do |t|
      t.references :user, null: false
      t.references :item
      t.boolean :collapsed, null: false
      t.boolean :starred, null: false

      t.timestamps
    end

    add_index :views, [:user_id, :item_id], unique: true
  end
end