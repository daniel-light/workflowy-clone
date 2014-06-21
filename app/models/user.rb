class User < ActiveRecord::Base
  validates :email, :session_token, presence: true, uniqueness: true
  validates :password_digest, presence: true
  validates :password, length: {minimum: 6, allow_nil: true}

  has_many :items

  before_validation do
    self.session_token ||= SecureRandom.urlsafe_base64(32)
  end

  def self.find_by_credentials(email, password)
    user = find_by(email: email)

    user if user.try(:is_password?, password)
  end

  attr_reader :password

  def password=(secret)
    return unless secret
    self.password_digest = BCrypt::Password.create(secret)
    @password = secret
  end

  def is_password?(secret)
    BCrypt::Password.new(password_digest).is_password?(secret)
  end

  def reset_session_token!
    self.session_token = SecureRandom.urlsafe_base64(32)
    save!
    session_token
  end

  def items_hash(head_id = nil)
    items_hash = Hash.new { |hash, key| hash[key] = [] }
    items_hash[:head] = nil

    items.order(:parent_id).order(:rank).each do |item|
      items_hash[item.parent_id] << item
      items_hash[:head] = item if item.id == head_id.to_i
    end

    items_hash
  end
end
