class JobSerializer < ActiveModel::Serializer
  attributes :id, 
  :uuid, 
  :job_name, 
  :calendar, 
  :inital_hours, 
  :hours_per_day, 
  :color, 
  :start_time, 
  :delivery, 
  :status, 
  :quadrent,
  :cut,
  :weld,
  :finish,
  :events 

  def events
    object.events.order(:id)
  end
end
