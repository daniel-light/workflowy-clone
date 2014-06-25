class Share < ActiveRecord::Base
  validates :user_id, :item_id, :url, presence: true
  validates :user_id, uniqueness: {scope: :item_id}
  validates :url, length: 32, uniqueness: true
  validates :can_edit, inclusion: {in: [false, true]}
  
  before_validation do
    self.url ||= SecureRandom::urlsafe_base64(32)
  end
    
  belongs_to :user
  belongs_to :item
end
