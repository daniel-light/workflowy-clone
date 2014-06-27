module ItemsHelper

  def breadcrumbs(item)
    ancestors = []
    parent = @nested_items[item.id][:parent][:item]

    until parent == nil
      ancestors.unshift(parent)
      parent = @nested_items[parent.id][:parent][:item]
    end

    ancestors.map do |item|
      "<a href=\"#{item_path(item)}\">#{h(item.title)}</a> >"
    end .join('')
  end

  def find_view(item)
    item.views.find { |view| view.user_id == current_user.id } || item.views.new
  end

  # mixed methods

  def nested_children(item)
    if @nested_items
      @nested_items[item.try(:id)][:children].map { |hash| hash[:item] }
    else
      []
    end
  end

  def max_rank(parent)
    children = parent.respond_to?(:children) ? parent.children : parent.to_a
    children.max_by(&:rank).try(:rank) || 0
  end
end
