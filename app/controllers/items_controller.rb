class ItemsController < ApplicationController
  before_action :require_signed_in
  before_action :require_owner, except: [:index, :create]

  def index
    @nested_items = current_user.nested_items
    @new_item = current_user.items.new
  end

  def show
    @nested_items = current_user.nested_items
    @new_item = @item.children.new(rank: max_rank(nested_children(@item)) + 100)
  end

  def create
    @item = Item.friendly.find(params[:id]) if params[:id]
    @nested_items = current_user.nested_items

    @new_item = (@item ? @item.children : current_user.items).new(item_params)
    @new_item.rank ||= max_rank(nested_children(@item)) + 100

    if @new_item.save
      redirect_to @item ? item_url(@item) : items_url
    else
      flash.now[:alert] = @new_item.errors.full_messages
      render @item ? :show : :index
    end
  end

  def collapse
    view = @item.views.where(user_id: current_user.id).first
    view ||= @item.views.new(user_id: current_user.id)
    view.toggle_collapsed!

    if params[:return_id] && !params[:return_id].empty?
      redirect_to item_url(params[:return_id])
    else
      redirect_to items_url
    end
  end

  def update
    if @item.update(item_params)
      redirect_to item_url(@item)
    else
      flash.now[:alert] = @item.errors.full_messages
      render :edit
    end
  end

  def destroy
    @item.destroy
    redirect_to items_url
  end

  helper_method :nested_children

  private

  def item_params
    params.require(:item).permit(:title, :notes, :rank)
  end

  def max_rank(parent)
    children = parent.respond_to?(:children) ? parent.children : parent.to_a
    children.max_by(&:rank).try(:rank) || 0
  end

  def nested_children(item)
    if @nested_items
      @nested_items[item.try(:id)][:children].map { |hash| hash[:item] }
    else
      []
    end
  end

  def require_owner
    @item = Item.friendly.find(params[:id])
    redirect_to root_url unless @item.user_id == current_user.id
  end
end
