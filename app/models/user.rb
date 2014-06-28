class User < ActiveRecord::Base
  validates :email, :session_token, presence: true, uniqueness: true
  validates :password_digest, presence: true
  validates :password, length: {minimum: 6, allow_nil: true}

  has_many :items
  has_many :views
  has_many :shares
  has_many :shared_items, through: :shares, source: :item

  before_validation do
    self.session_token ||= SecureRandom.urlsafe_base64(32)
  end

  after_create do
    views.create!
  end

  def self.find_by_credentials(email, password)
    user = find_by(email: email)

    user if user.try(:is_password?, password)
  end

  def self.find_or_create_by_auth_hash(auth_hash)
    user = self.find_by(uid: auth_hash[:uid], provider: auth_hash[:provider])

    unless user
      user = create!(
        uid: auth_hash[:uid],
        provider: auth_hash[:provider],
        email: auth_hash[:info][:email],
        password_digest: SecureRandom::urlsafe_base64(16)
      )
    end

    user
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

  def nested_items
    @better_hash = Hash.new do |hash, key|
      hash[key] = {item: nil, parent: nil, children: []}
    end

    #TODO trim includes down?
    items
      .includes([:shares, :views]) # we are deprecating views here, at the least
      .joins('LEFT OUTER JOIN views ON items.id = views.item_id')
      .where('views.user_id IS NULL OR views.user_id = ?', id)
      .select('items.*, views.collapsed AS collapsed, views.id AS view_id')
      .order(:rank)
    .each do |item|
      @better_hash[item.id][:item] = item
      @better_hash[item.id][:parent] = @better_hash[item.parent_id]
      @better_hash[item.parent_id][:children] << @better_hash[item.id]
    end

    @better_hash
  end
end
