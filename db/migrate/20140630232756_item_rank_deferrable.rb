class ItemRankDeferrable < ActiveRecord::Migration
  def up
    remove_index :items, [:user_id, :parent_id, :rank]

    execute <<-SQL
      ALTER TABLE items
      ADD CONSTRAINT items_rank UNIQUE (user_id, parent_id, rank)
      DEFERRABLE INITIALLY IMMEDIATE;
    SQL
  end

  def down
    execute <<-SQL
      ALTER TABLE items
      DROP CONSTRAINT IF EXISTS items_rank;
    SQL

    add_index :items, [:user_id, :parent_id, :rank], unique: true
  end
end
