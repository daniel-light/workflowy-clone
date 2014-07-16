class SessionsController < ApplicationController

  def new
    @user = User.new
  end

  def create
    user = User.find_by_credentials(user_params[:email], user_params[:password])

    if user
      sign_in!(user)
      redirect_to root_url
    else
      @user = User.new(user_params)
      flash.now[:alert] = 'Invalid username or password'
      render :new
    end
  end

  def destroy
    sign_out!
    redirect_to root_url
  end

  def google_login
    user = User.find_or_create_by_auth_hash(request.env['omniauth.auth'])
    sign_in!(user)

    redirect_to root_url
  end

  def demo
    demo_user = User.create!(
      email: SecureRandom.uuid + '@example.com',
      password: 'green1'
    )

    sign_in!(demo_user)
    redirect_to root_url
  end

  private

  def user_params
    params.require(:user).permit(:email, :password)
  end
end
