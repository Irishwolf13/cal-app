class JobSerializer < ActiveModel::Serializer
  attributes :id, :uuid, :job_name, :inital_hours, :hours_per_day, :color, :start_time, :events
end
