class Share < ActiveRecord::Base
  validates :item_id, presence: true
  validates :user_id, uniqueness: {scope: :item_id}
  validates :can_edit, inclusion: {in: [false, true]}
  validate :no_self_sharing

  before_validation do
    self.can_edit = false if can_edit.nil?

    true
  end

  belongs_to :user
  belongs_to :item

  def toggle_editable!
    update!(can_edit: !can_edit)
    can_edit
  end

  private

  def no_self_sharing
    if !item || user_id == item.user_id
      errors.add(:user_id, 'can\'t share with yourself')
    end
  end
end
