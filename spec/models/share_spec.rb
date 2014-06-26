require 'rails_helper'

RSpec.describe Share, :type => :model do
  before(:each) do
    create(:user, id: 1)
    create(:item, id: 1, user_id: 1)
  end

  context 'validations' do
    it 'should be valid with a user_id and an item_id' do
      expect(create(:item).shares.new(user_id: 3)).to be_valid
    end

    it { should validate_presence_of(:item_id) }

    it do
      create(:share, user_id: 0, item_id: 1)
      should validate_uniqueness_of(:user_id).scoped_to(:item_id)
    end

    it 'should be able to have multiple users per item' do
      create(:share, user_id: 2, item_id: 1)
      expect(build(:share, user_id: 3, item_id: 1)).to be_valid
    end

    it 'should automatically set a nil can_edit' do
      share = build(:share, can_edit: nil)
      share.valid?
      expect(share.can_edit).to be false
    end

    it 'should not let you share with yourself' do
      expect(build(:share, user_id: 1, item_id: 1)).not_to be_valid
    end
  end

  context 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:item) }
  end
end
