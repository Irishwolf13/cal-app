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
  :cnc_done,
  :quality_control,
  :quality_done,
  :product_tag,
  :product_done,
  :hardware,
  :hardware_done,
  :powder_coating,
  :powder_done,
  :powder_colors,
  :memo_boxes,
  :checks,
  :events 

  def events
    object.events.order(:id)
  end
end
