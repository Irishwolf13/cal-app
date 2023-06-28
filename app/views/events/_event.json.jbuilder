json.extract! event, :id, :job_id, :start, :end, :hours_per_day, :hours_remaining, :color, :created_at, :updated_at
json.url event_url(event, format: :json)
