class SharesController < ApplicationController
  before_action :require_signed_in

  def index
    @item = Item.find(params[:item_id])
    @shares = @item.shares.includes(:user)
    @share = @item.shares.new
  end

  def create
    @item = Item.find(params[:item_id])
    @shares = @item.shares.includes(:user)
    @share = @item.shares.new(shares_params)

    if  @share.save
      redirect_to item_shares_url(@item)
    else
      flash.now[:alert] = @share.errors.full_messages
      render :index
    end
  end

  def destroy
    @share = Share.find(params[:id])
    @share.destroy
    redirect_to item_shares(@share.item_id)
  end

  private

  def shares_params
    params.require(:share).permit(:user_id, :can_edit)
  end
end
