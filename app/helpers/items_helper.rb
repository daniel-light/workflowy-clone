module ItemsHelper
  def max_rank(parent)
    children = parent.respond_to?(:children) ? parent.children : parent.to_a
    children.max_by(&:rank).try(:rank) || 0
  end
end
