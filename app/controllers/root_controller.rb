class RootController < ApplicationController

  def index
    @user = User.new unless signed_in?
  end
end
