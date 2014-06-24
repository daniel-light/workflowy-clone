class ItemsController < ApplicationController

  def index
    @items_hash = current_user.items_hash
    @new_item = current_user.items.new
  end

  def show
    @items_hash = current_user.items_hash(params[:id])
    @item = @items_hash[:head]
    @new_item = @item.children.new(rank: max_rank(@items_hash[@item.id]) + 100)
    raise ActionController::RoutingError.new('Not Found') unless @item
  end

  def create
    @items_hash = current_user.items_hash(params[:id])

    if @item = @items_hash[:head]
      @new_item = @item.children.new(item_params)
      @new_item.user_id = current_user.id
      @new_item.rank ||= max_rank(@items_hash[@item.id]) + 100
      if @new_item.save
        redirect_to item_url(@new_item.parent_id)
      else
        flash.now[:alert] = @new_item.errors.full_messages
        render :show
      end

    else
      @new_item = current_user.items.new(item_params)
      @new_item.rank ||= max_rank(@items_hash[nil]) + 100
      if @new_item.save
        redirect_to items_url
      else
        render :index
      end
    end
  end

  def collapse
    item = Item.find(params[:id])
    view = item.views.where(user_id: current_user.id).first
    view.toggle_collapsed!

    redirect_to params[:return_id] ? items_url : item_url(params[:return_id])
  end

  def update
    @item = Item.find(params[:id])

    if @item.update(item_params)
      redirect_to item_url(@item)
    else
      flash.now[:alert] = @item.errors.full_messages
      render :edit
    end
  end

  def destroy
    Item.find(params[:id]).destroy
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
end
