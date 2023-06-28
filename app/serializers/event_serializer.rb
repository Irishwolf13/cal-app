class EventSerializer < ActiveModel::Serializer
  attributes :id, :job_id, :start_time, :end_time, :hours_per_day, :hours_remaining, :color, :job
end
