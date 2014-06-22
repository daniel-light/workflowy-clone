Rails.application.routes.draw do
  root to: 'root#index'
  resource :session, only: [:new, :create, :destroy]
  resources :users, only: [:new, :create]
  resources :items, except: [:new] do
    member do
      post action: :create
    end
  end
end
