namespace :jobs do
  desc "Destroy all jobs"
  task destroy_all: :environment do
    Job.destroy_all
    puts "All jobs have been destroyed."
  end
end