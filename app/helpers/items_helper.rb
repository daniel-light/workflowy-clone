module ItemsHelper
  def breadcrumbs_from_hash(views_hash, item)
    parent_id = item.parent_id
    ancestors = []

    until parent_id == nil
      grand_parent_id = views_hash[:reverse][parent_id]
      parent = views_hash[grand_parent_id].find { |view| view.item.id == parent_id }
      ancestors << parent.item
      parent_id = grand_parent_id
    end

    ancestors.reverse.map do |item|
      "<a href=\"#{
        item ? item_path(item) : items_path
      }\">#{h(item.title)}</a> >"
    end .join('')
  end
end
