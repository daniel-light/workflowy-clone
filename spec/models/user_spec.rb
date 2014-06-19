require 'rails_helper'

RSpec.describe User, :type => :model do
  let(:user) { create(:user) }

  it 'should not generate a password digest from a nil password' do
    expect(build(:user, password: nil).password_digest).to be_nil
  end

  it '#reset_session_token! should reset the session token' do
    starting_token = user.session_token
    user.reset_session_token!
    expect(user.session_token).not_to eq(starting_token)
  end

  context '#is_password?' do
    it 'should return true if the password matches' do
      expect(user.is_password?('green1')).to be true
    end

    it 'should return false if the password does not match' do
      expect(user.is_password?('green2')).to be false
    end
  end

  context '::find_by_credentials' do
    before(:each) do
      user
    end

    it 'should return the user if email and password match' do
      expect(User.find_by_credentials('example@example.com', 'green1')).to eq(user)
    end

    it 'should return nil if there is no such user' do
      expect(User.find_by_credentials('not_a_user', '')).to be nil
    end

    it 'should return nil if the password does not match' do
      expect(User.find_by_credentials('example@example.com', '')).to be nil
    end
  end

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
