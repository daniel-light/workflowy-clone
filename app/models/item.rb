class Item < ActiveRecord::Base
  validates :user_id, :title, :rank, presence: true
  validates :rank, uniqueness: {scope: [:parent_id, :user_id]}
  validates :url, length: {is: 43}, uniqueness: true, allow_nil: true

  belongs_to :user
  has_many :views, dependent: :destroy
  has_many :shares

  belongs_to :parent, class_name: 'Item', inverse_of: :children

  has_many :children, class_name: 'Item',
           foreign_key: :parent_id,
           dependent: :destroy,
           inverse_of: :parent

  before_validation do
    self.user_id ||= parent.try(:user_id)
  end

  after_create :create_views

  def shortened_notes
    if notes
      notes.split(/\r?\n/).first
    else
      ''
    end
  end

  def can_edit?(user)
    return true if user_id == user.try(:id)
    items_hash = user.try(:item_hash) || self.user.items_hash

    return true if is_shared_with_edit(user)

    top_parent_id = parent_id
    until top_parent_id == nil
      grand_parent_id = items_hash[:reverse][top_parent_id]
      top_parent = items_hash[grand_parent_id].find { |item| item.id == top_parent_id }
      top_parent_id = grand_parent_id
      return true if top_parent && top_parent.is_shared_with_edit(user)
    end

    false
  end

  protected

  def is_shared_with_edit(user)
    shares.any? do |share|
      share.can_edit && (share.user_id.nil? || share.user_id == user.id)
    end
  end

  private

  def create_views
    views.create!(user_id: user_id)

    if parent
      parent.shares.each do |share|
        views.create!(user_id: share.user_id)
      end
    end
  end
end
