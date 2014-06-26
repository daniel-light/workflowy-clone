class ItemsController < ApplicationController
  before_action :require_signed_in
  before_action :require_editor, only: [:update]

  def index
    @views_hash = current_user.views_hash
    @new_item = current_user.items.new
  end

  def show
    @item = Item.find(params[:id])
    @views_hash = current_user.views_hash(params[:id])
    @new_item = @item.children.new(rank: max_rank(@views_hash[@item.id].map(&:item)) + 100)
    raise ActionController::RoutingError.new('Not Found') unless @item
  end

  def create
    return if require_editor
    @items_hash = current_user.items_hash(params[:id])
    @item = @items_hash[:head]

    @new_item = (@item ? @item.children : current_user.items).new(item_params)
    @new_item.rank ||= max_rank(@items_hash[@item.try(:id)]) + 100

    if @new_item.save
      redirect_to @item ? item_url(@item) : items_url
    else
      flash.now[:alert] = @new_item.errors.full_messages
      render @item ? :show : :index
    end
  end

  def collapse
    view = @item.views.where(user_id: current_user.id).first
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

  private

  def item_params
    params.require(:item).permit(:title, :notes, :rank)
  end

  def max_rank(parent)
    children = parent.respond_to?(:children) ? parent.children : parent.to_a
    children.max_by(&:rank).try(:rank) || 0
  end

  def require_authorized
    @item = Item.find(params[:id])
    redirect_to root_url unless @item.user_id == current_user.id
  end

  def require_editor
    @item = Item.find(params[:id])
    redirect_to root_url unless @item.can_edit?(current_user)
  end
end
