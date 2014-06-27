class RootController < ApplicationController

  def index
    if signed_in?
      @nested_items = current_user.nested_items
      @nested_items.each do |key, item_hash|
        item_hash.delete(:parent)
      end
      @nested_items = @nested_items[nil][:children]
      render :index
    else
      @user = User.new
      render :home
    end
  end
end
