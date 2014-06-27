Rails.application.routes.draw do
  root to: 'root#index'

  resource :session, only: [:new, :create, :destroy]
  get '/auth/google_oauth2/callback', to: 'sessions#google_login'
  resources :users, only: [:new, :create]

  resources :items, except: [:new, :edit], shallow: true do
    member do
      post action: :create
      patch :collapse
    end

    resources :shares, only: [:index, :create]
  end

  resources :shares, only: [:show, :destroy] do
    patch :editable, on: :member
  end
end
