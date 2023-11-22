Rails.application.routes.draw do
  resources :checks
  resources :powder_colors
  resources :calendars
  resources :daily_maximums
  resources :events
  resources :jobs
  resources :memo_boxes
  resources :powder_colors
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  # route to test your configuration, not used anymore
  # get '/hello', to: 'application#hello_world'
  patch '/jobs/move/:id', to: 'jobs#move', as: 'move_job'
  patch '/jobs/add/:id', to: 'jobs#add', as: 'add_job'
  patch '/jobs/sub/:id', to: 'jobs#sub', as: 'sub_job'
end
