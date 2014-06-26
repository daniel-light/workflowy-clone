class Share < ActiveRecord::Base
  validates :item_id, presence: true
  validates :user_id, uniqueness: {scope: :item_id}
  validates :can_edit, inclusion: {in: [false, true]}

  before_validation do
    self.can_edit = false if can_edit.nil?

    true
  end

  after_create :create_views

  belongs_to :user
  belongs_to :item

  private

  def create_views
    return if user_id.nil?

    items_hash = item.user.items_hash
    queue = [item]

    until queue.empty?
      item = queue.shift
      item.views.create!(user_id: user_id)
      queue.concat(items_hash[item.id])
    end
  end

  def destroy_views
    views_hash = item.user.views_hash
    queue = [item.views.find_by(user_id: user_id)]

    until queue.empty?
      view = queue.shift
      next if view.item.shares.length > 1
      queue.concat(views_hash[view.item.id])
      view.destroy
    end
  end
end
