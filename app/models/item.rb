class Item < ActiveRecord::Base
  validates :user_id, :title, :rank, presence: true
  validates :rank, uniqueness: {scope: [:parent_id, :user_id]}

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

  after_create do
    views.create!(user_id: user_id)
  end

  def shortened_notes
    if notes
      notes.split(/\r?\n/).first
    else
      ''
    end
  end
end
