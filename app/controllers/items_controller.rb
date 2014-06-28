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
    if params[:id]
      @item = Item.friendly.find(params[:id])
      return redirect_to items_url unless @item.can_edit?(current_user)
    end
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

    if request.xhr?
      render json: {collapsed: view.collapsed}
    elsif params[:return_id] && !params[:return_id].empty?
      redirect_to item_url(params[:return_id])
    else
      redirect_to items_url
    end
  end

  def update
    if @item.update(item_params)
      request.xhr? ? (render json: @item) : (redirect_to item_url(@item))
    else
      flash.now[:alert] = @item.errors.full_messages
      if request.xhr?
        render status: 400, json: @item
      else
        render :edit
      end
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

  def require_owner
    @item = Item.friendly.find(params[:id])
    redirect_to root_url unless @item.user_id == current_user.id
  end
end
