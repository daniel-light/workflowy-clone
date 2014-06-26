require 'rails_helper'

RSpec.describe Item, :type => :model do

  context 'validations' do
    it 'validates when given a user_id, title and rank' do
      expect(create(:item)).to be_valid
    end

    it 'must have a user' do
      expect(build(:item, user_id: nil)).not_to be_valid
    end

    it 'must have a title' do
      expect(build(:item, title: nil)).not_to be_valid
    end

    it 'must have a rank' do
      expect(build(:item, rank: nil)).not_to be_valid
    end

    it 'cannot have the same rank as another item with the same parent' do
      parent = create(:item)
      first_child = parent.children.create(title: 'first', user_id: 1, rank: 1)
      second_child = parent.children.build(title: 'second', user_id: 1, rank: 1)
      expect(second_child).not_to be_valid
    end

    it 'can have the same rank as another item with a different parent' do
      parent = create(:item)
      first_child = parent.children.create(title: 'first', user_id: 1, rank: 1)
      second_parent = create(:item)
      second_child = second_parent.children.create(title: 'first', user_id: 1, rank: 1)
      expect(second_child).to be_valid
    end

    it do
      create(:item, url: 'a' * 43)
      should validate_uniqueness_of(:url).allow_nil
    end

    it 'should not allow url strings that are the incorrect length' do
      expect(build(:item, url: 'abc')).not_to be_valid
    end
  end

  context 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:parent) }
    it { should have_many(:children) }
    it { should have_many(:views) }
    it { should have_many(:shares) }
  end

  context '#can_edit?' do
    let(:items) { [create(:item, id: 1, user: owner),
                   create(:item, id: 2, parent_id: 1),
                   create(:item, id: 3, parent_id: 2)] }
    let(:owner) { create(:user, id: 1) }
    let(:user) { User.create(id: 2, email: 'a', password: '123456') }

    it 'should be editable by the owner' do
      expect(items.all? { |item| item.can_edit?(owner) }).to be true
    end

    it 'shouldn\'t be editable by another user' do
      expect(items.none? { |item| item.can_edit?(user) }).to be true
    end

    it 'should be editable by a user once shared with edit set' do
      items.first.shares.create!(user_id: 2, can_edit: true)
      expect(items.all? { |item| item.can_edit?(user) }).to be true
    end

    it 'should\'t be editable by a user if shared without edit set' do
      items.first.shares.create!(user_id: 2, can_edit: false)
      expect(items.none? { |item| item.can_edit?(user) }).to be true
    end

    it 'should be editable by anyone once shared anonymously with edit set' do
      items.first.shares.create!(user_id: nil, can_edit: true)
      expect(items.all? { |item| item.can_edit?(nil) }).to be true
    end

    it 'should\'t be editable by anonymous without edit set' do
      items.first.shares.create!(user_id: 2, can_edit: false)
      expect(items.none? { |item| item.can_edit?(nil) }).to be true
    end
  end
end