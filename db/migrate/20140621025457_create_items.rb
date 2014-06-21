class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.references :user
      t.integer :parent_id
      t.integer :rank
      t.text :title
      t.text :notes

      t.timestamps
    end

    add_index :items, [:user_id, :parent_id, :rank], unique: true
  end
end
