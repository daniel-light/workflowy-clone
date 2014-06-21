class Item < ActiveRecord::Base
  validates :user_id, :title, :rank, presence: true
  validates :rank, uniqueness: {scope: :parent_id}

  belongs_to :user
  belongs_to :parent, class_name: 'Item'
  has_many :children, class_name: 'Item', foreign_key: :parent_id
end
