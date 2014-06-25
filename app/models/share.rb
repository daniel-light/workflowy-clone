class Share < ActiveRecord::Base
  validates :user_id, :item_id, presence: true
  validates :user_id, uniqueness: {scope: :item_id}
  validates :can_edit, inclusion: {in: [false, true]}

  before_validation do
    self.can_edit = false if can_edit.nil?

    true
  end

  belongs_to :user
  belongs_to :item
end
