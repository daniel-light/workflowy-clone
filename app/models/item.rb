class Item < ActiveRecord::Base
  validates :user_id, :rank, :uuid, presence: true
  validates :rank, uniqueness: {scope: [:user_id, :parent_id]}
  validates :uuid, length: {is: 36}, uniqueness: true

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
    self.uuid ||= SecureRandom::uuid
    self.title ||= ''
    self.notes ||= ''
  end

  extend FriendlyId
  friendly_id :uuid

  def self.rerank(ranks_hash)
    transaction do
      connection.execute 'SET CONSTRAINTS items_rank DEFERRED'
      ranks_hash.keys.each do |id|
        next if id == 'undefined'
        update(id, rank: ranks_hash[id])
      end
    end
  end

  def shortened_notes
    ''
  end

  def can_view?(viewer)
    return true if user_id == viewer.try(:id)
    nested_items = user.nested_items

    current_item = nested_items[id][:item]
    until current_item == nil
      return true if current_item.is_shared_with?(viewer)
      current_item = nested_items[current_item.id][:parent][:item]
    end

    false
  end

  def can_edit?(editor)
    return true if user_id == editor.try(:id)
    nested_items = user.nested_items

    current_item = nested_items[id][:item]
    until current_item == nil
      return true if current_item.is_shared_with_edit?(editor)
      current_item = nested_items[current_item.id][:parent][:item]
    end

    false
  end

  protected

  def is_shared_with?(viewer)
    shares.any? do |share|
      share.user_id.nil? || share.user_id == viewer.try(:id)
    end
  end

  def is_shared_with_edit?(editor)
    shares.any? do |share|
      share.can_edit && (share.user_id.nil? || share.user_id == editor.try(:id))
    end
  end
end
