class AllowNullItemTitles < ActiveRecord::Migration
  def up
    change_table :items do |t|
      t.change :title, :string, null: true
      t.change :user_id, :integer, null: false
      t.change :uuid, :string, null: false
    end
  end

  def down
    change_table :items do |t|
      t.change :title, :string, null: false
      t.change :user_id, :integer, null: true
      t.change :uuid, :string, null: true
    end
  end
end
