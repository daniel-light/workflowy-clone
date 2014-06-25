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
