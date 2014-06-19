require 'rails_helper'

RSpec.describe User, :type => :model do
  it 'validates when given an email and password' do
    expect(create(:user)).to be_valid
  end
end
