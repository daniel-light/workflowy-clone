require 'rails_helper'

RSpec.describe User, :type => :model do

  context 'validations' do
    it 'validates when given an email and password' do
      expect(create(:user)).to be_valid
    end

    it 'must have an email' do
      expect(build(:user, email: nil)).not_to be_valid
    end

    it 'must have a password that is six characters or more' do
      expect(build(:user, password: 'abc')).not_to be_valid
    end

    it 'can have a nil password only when password digest is provied' do
      expect(build(:user, password: nil)).not_to be_valid
      expect(build(:user, password: nil, password_digest: 'a')).to be_valid
    end

    it 'should generate a session token on validation' do
      user = build(:user)
      expect(user.session_token).to be_nil
      user.valid?
      expect(user.session_token).not_to be_nil
    end
  end
end
