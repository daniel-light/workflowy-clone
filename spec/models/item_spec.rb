require 'rails_helper'

RSpec.describe Item, :type => :model do

  context 'validations' do
    it 'validates when given a user_id and rank' do
      expect(create(:item)).to be_valid
    end

    it { should validate_presence_of(:user_id) }

    it { should validate_presence_of(:rank) }

    it do
      create(:item)

      should validate_uniqueness_of(:rank).scoped_to([:user_id, :parent_id])
    end

    it 'can have the same rank as another item with a different parent' do
      parent = create(:item)
      first_child = parent.children.create(user_id: 1, rank: 1)
      second_parent = create(:item)
      second_child = second_parent.children.create(user_id: 1, rank: 1)
      expect(second_child).to be_valid
    end

    it do
      create(:item)

      should validate_uniqueness_of(:uuid)
    end
    it { should ensure_length_of(:uuid).is_equal_to(36) }

    it 'should automatically set a blank uuid' do
      item = build(:item, uuid: nil)
      item.valid?
      expect(item.uuid.length).to eq(36)
    end

    it 'should automatically set a blank title' do
      item = build(:item, title: nil)

      item.valid?

      expect(item.title).to eq('')
    end

    it 'should automatically set blank notes' do
      item = build(:item, notes: nil)

      item.valid?

      expect(item.notes).to eq('')
    end
  end

  context 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:parent) }
    it { should have_many(:children) }
    it { should have_many(:views) }
    it { should have_many(:shares) }
  end

  context '#can_view?' do
    let(:items) { [create(:item, id: 1, user: owner),
                   create(:item, id: 2, parent_id: 1),
                   create(:item, id: 3, parent_id: 2)] }
    let(:owner) { create(:user, id: 1) }
    let(:user) { User.create(id: 2, email: 'a', password: '123456') }

    it 'should be viewable by the owner' do
      expect(items.all? { |item| item.can_view?(owner) }).to be true
    end

    it 'shouldn\'t be viewable by another user' do
      expect(items.none? { |item| item.can_view?(user) }).to be true
    end

    it 'should be viewable by a user once shared' do
      items.first.shares.create!(user_id: 2)
      expect(items.all? { |item| item.can_view?(user) }).to be true
    end

    it 'should be viewable by anyone once shared anonymously' do
      items.first.shares.create!(user_id: nil)
      expect(items.all? { |item| item.can_view?(nil) }).to be true
    end
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
