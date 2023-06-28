class EventSerializer < ActiveModel::Serializer
  attributes :id, :job_id, :start, :end, :hours_per_day, :hours_remaining, :color, :job
end
