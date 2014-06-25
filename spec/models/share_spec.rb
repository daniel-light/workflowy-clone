require 'rails_helper'

RSpec.describe Share, :type => :model do

  context 'validations' do
    it 'should be valid with a user_id and an item_id' do
      expect(Share.create(user_id: 1, item_id: 1)).to be_valid
    end

    it { should validate_presence_of(:item_id) }

    it { should validate_presence_of(:user_id) }
    it { should validate_uniqueness_of(:user_id).scoped_to(:item_id) }

    it 'should automatically set a nil can_edit' do
      share = build(:share, can_edit: nil)
      share.valid?
      expect(share.can_edit).to be false
    end
  end

  context 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:item) }
  end
end
