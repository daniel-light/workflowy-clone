module ItemsHelper
  def breadcrumbs_from_hash(items_hash, item)
    parent_id = item.parent_id
    ancestors = []

    until parent_id == nil
      grand_parent_id = items_hash[:reverse][parent_id]
      parent = items_hash[grand_parent_id].find { |item| item.id == parent_id }
      ancestors << parent
      parent_id = grand_parent_id
    end

    ancestors.reverse.map do |item|
      "<a href=\"#{items_path(item)}\">#{h(item.title)}</a> >"
    end .join('')
  end
end
