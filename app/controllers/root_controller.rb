class RootController < ApplicationController

  def index
    if signed_in?
      redirect_to items_url
    else
      @user = User.new
    end
  end
end
