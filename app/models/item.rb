class Item < ActiveRecord::Base
  validates :user_id, :title, :rank, presence: true
  validates :rank, uniqueness: {scope: [:parent_id, :user_id]}
  validates :url, length: {is: 43}, uniqueness: true, allow_nil: true

  belongs_to :user
  has_many :views
  has_many :shares

  belongs_to :parent, class_name: 'Item', inverse_of: :children

  has_many :children, class_name: 'Item',
           foreign_key: :parent_id,
           dependent: :destroy,
           inverse_of: :parent

  before_validation do
    self.user_id ||= parent.try(:user_id)
  end

  after_create :create_views_and_shares

  def shortened_notes
    if notes
      notes.split(/\r?\n/).first
    else
      ''
    end
  end

  def can_edit?(user)
    return true if user_id == user.id

    return true if shares.any? do |share|
      share.can_edit && (share.user_id.nil? || share.user_id == user.id)
    end

    top_parent_id = parent_id
    until top_parent_id == nil
      grand_parent_id = user.items_hash[:reverse][top_parent_id]
      top_parent = user.items_hash[grand_parent_id].find { |item| item.id == top_parent_id }
      top_parent_id = grand_parent_id
      top_parent.nil? || (return true if top_parent.shares.any? do |share|
        share.can_edit && (share.user_id.nil? || share.user_id == user.id)
      end)
    end

    false
  end

  private

  def create_views_and_shares
    views.create!(user_id: user_id)

    if parent
      parent.shares.each do |share|
        views.create!(user_id: share.user_id)
      end
    end
  end
end
