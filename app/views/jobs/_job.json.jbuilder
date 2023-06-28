json.extract! job, :id, :job_name, :inital_hours, :hours_per_day, :color, :created_at, :updated_at
json.url job_url(job, format: :json)
