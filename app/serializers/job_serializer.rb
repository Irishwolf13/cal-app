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
  :in_hand,
  :status, 
  :quadrent,
  :cut,
  :weld,
  :finish,
  :cnc_parts,
  :quality_control,
  :product_tag,
  :hardware,
  :powder_coating,
  :powder_colors,
  :memo_boxes,
  :check_boxes,
  :events 

  def events
    object.events.order(:id)
  end
end
