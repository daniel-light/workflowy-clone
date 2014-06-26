class ChangeItemsUrlToUuid < ActiveRecord::Migration
  def change
    remove_index :items, :url
    remove_column :items, :url, :string, length: 43

    add_column :items, :uuid, :string, limit: 36, null: false
    add_index :items, :uuid, unique: true
  end
end
