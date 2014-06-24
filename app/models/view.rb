class View < ActiveRecord::Base
  validates :user_id, presence: true
  validates :item_id, uniqueness: {scope: :user_id}
  validates :collapsed, :starred, inclusion: {in: [false, true]}

  before_validation do
    self.collapsed = false if collapsed.nil?
    self.starred = false if starred.nil?

    true
  end

  belongs_to :user
  belongs_to :item
end