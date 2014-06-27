class SharesController < ApplicationController
  before_action :require_signed_in
  before_action :require_owner

  def index
    @shares = @item.shares.includes(:user)
    @share = @item.shares.new
  end

  def create
    @shares = @item.shares.includes(:user)
    @share = @item.shares.new(shares_params)

    if  @share.save
      redirect_to item_shares_url(@item)
    else
      flash.now[:alert] = @share.errors.full_messages
      render :index
    end
  end

  def editable
    @share.toggle_editable!

    redirect_to item_shares_url(@item)
  end

  def destroy
    @share.destroy
    redirect_to item_shares_url(@share.item_id)
  end

  private

  def shares_params
    params.require(:share).permit(:user_id, :can_edit)
  end

  def require_owner
    if params[:item_id]
      @item = Item.friendly.find(params[:item_id])
    else
      @share = Share.find(params[:id])
      @item = @share.item
    end
    redirect_to root_url unless @item.user_id == current_user.id
  end
end
