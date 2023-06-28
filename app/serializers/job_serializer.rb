class JobSerializer < ActiveModel::Serializer
  attributes :id, :job_name, :inital_hours, :hours_per_day, :color, :start, :events
end
