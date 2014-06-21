class ItemsController < ApplicationController

  def index
    @items_hash = current_user.items_hash
  end

  def show
    @items_hash = current_user.items_hash(params[:id])
    @item = @items_hash[:head]
    raise ActionController::RoutingError.new('Not Found') unless @item
  end

  def new
    @item = current_user.items.new
  end

  def create
    @item = current_user.items.new(item_params)

    if @item.save
      redirect_to item_url(@item)
    else
      flash.alert.now = @item.errors.full_messages
      render :new
    end
  end

  def edit
    @item = Item.find(params[:id])
  end

  def update
    @item = Item.find(params[:id])

    if @item.update(item_params)
      redirect_to item_url(@item)
    else
      flash.alert.now = @item.errors.full_messages
      render :edit
    end
  end

  def destroy
    Item.find(params[:id]).destroy
    redirect_to items_url
  end

  private

  def item_params
    params.require(:item).permit(:title, :notes, :parent_id, :rank)
  end
end
