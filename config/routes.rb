Rails.application.routes.draw do
  resources :events
  resources :jobs
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  # route to test your configuration, not used anymore
  # get '/hello', to: 'application#hello_world'
end
