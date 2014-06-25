Rails.application.routes.draw do
  root to: 'root#index'
  resource :session, only: [:new, :create, :destroy]
  resources :users, only: [:new, :create]
  
  shallow do
    resources :items, except: [:new, :edit] do
      member do
        post action: :create
        patch :collapse
      end
      
      resources :shares, except: [:new, :edit]
    end
  end
end
