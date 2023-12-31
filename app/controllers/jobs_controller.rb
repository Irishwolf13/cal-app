class JobsController < ApplicationController
  before_action :set_job, only: %i[ show update destroy ]

  def index
    @jobs = Job.includes(:events).all # Include all events associated with each job
    render json: @jobs
  end

  def show
    @job = Job.includes(:events).find(params[:id])
    render json: @job, include: :events
  end

  def create
    @job = Job.new(job_params)
    # puts "************************************* HERE *******************************"
    # puts job_params
    # puts params
    @job.uuid = UUID.new.generate
    @job.save

    hours_remaining = @job.inital_hours
    current_date = @job.start_time
    my_hours_per_day = @job.hours_per_day

    while hours_remaining > 0
      if !current_date.saturday? && !current_date.sunday?
        if hours_remaining - my_hours_per_day < 0
          my_hours_per_day = hours_remaining
        end
        my_object = {
          job_id: @job.id,
          start_time: current_date,
          end_time: current_date,
          hours_per_day: my_hours_per_day,
          hours_remaining: hours_remaining,
          color: @job.color,
          uuid: UUID.new.generate
        }
        Event.create(my_object)
        hours_remaining -= my_hours_per_day
      end
      current_date += 1
    end

    params[:memo_boxes].each do |memo_box|
      MemoBox.create(memo: memo_box, job_id: @job.id)
    end

    params[:checks].each do |check_box|
      next if check_box.blank?
    
      Check.create(title: check_box, job_id: @job.id, status: true, done: false)
    end

    if @job.save
      render json: @job, include: :events, status: :created, location: @job
    else
      render json: @job.errors, status: :unprocessable_entity
    end
  end

  def update
    @job = Job.find(params[:id])
    if !params[:newColor].to_s.empty?
      puts params[:newColor]
      process_color_change
    end
    process_hours_change if !params[:newHours].to_s.empty?
    process_per_day_change if params[:newPerDay]
    
    @job.job_name = params[:newTitle] if !params[:newTitle].to_s.empty?
    @job.delivery = params[:newDelivery] if params[:newDelivery]
    @job.calendar = params[:newCalendar] if params[:newCalendar]
    @job.in_hand = params[:in_hand] if params[:in_hand].present?
    @job.status = params[:status] if params[:status]
    @job.quadrent = params[:quadrent] if params[:quadrent]
    @job.cut = params[:cut] if params[:cut]
    @job.weld = params[:weld] if params[:weld]
    @job.finish = params[:finish] if params[:finish]
    @job.cnc_parts = params[:cnc_parts] if params[:cnc_parts]
    @job.cnc_done = params[:cnc_done] if params[:cnc_done]
    @job.quality_control = params[:quality_control] if params[:quality_control]
    @job.quality_done = params[:quality_done] if params[:quality_done]
    @job.product_tag = params[:product_tag] if params[:product_tag]
    @job.product_done = params[:product_done] if params[:product_done]
    @job.hardware = params[:hardware] if params[:hardware]
    @job.hardware_done = params[:hardware_done] if params[:hardware_done]
    @job.powder_coating = params[:powder_coating] if params[:powder_coating]
    @job.powder_done = params[:powder_done] if params[:powder_done]
    if params[:memo_boxes]
      params[:memo_boxes].each do |memo_box|
        MemoBox.create(memo: memo_box, job_id: @job.id)
      end
    end

    if params[:checks]
      params[:checks].each do |check_box|
        Check.create(title: check_box, job_id: @job.id, status: true)
      end
    end

    @job.save
    render json: @job, include: :events, status: :created, location: @job
  end

  def move
    @job = Job.find(params[:id])
    current_date = Date.parse(params[:newDate])

    @job.events.order(:id).each do |event|
      if (event.id < params[:myID])
        event.save
      end
      if event.id == params[:myID]
        while current_date.saturday? || current_date.sunday?
          current_date += 1
        end
        # Update the event with current_date
        event.start_time = current_date
        event.end_time = current_date
        event.save
        current_date += 1
      end
      if event.id > params[:myID]
        while current_date.saturday? || current_date.sunday?
          current_date += 1
        end
        # Update the event with current_date
        event.start_time = current_date
        event.end_time = current_date
        event.save
        current_date += 1
      end
    end
    render json: @job, include: :events, status: :created, location: @job
  end

  def destroy
    @job = Job.find(params[:id])
    @job.destroy
  end

  def destroy_all
    Job.delete_all
  end

  def add
    @loop_number = params[:numb_add]
    while @loop_number > 0 do
      @job = Job.find(params[:id])
      highest_id_event = @job.events.max_by { |event| event.id }
      # checks to see if the date is a Saturday and ajusts it to Monday
      @myDay = highest_id_event.start_time.wday + 1
      if @myDay == 6
        newDate = highest_id_event.start_time + 3
      else
        newDate = highest_id_event.start_time + 1
      end
      if @loop_number > 1
        new_hours_per_day = @job.hours_per_day
      end
      if @loop_number == 1
        new_hours_per_day = highest_id_event.hours_remaining - highest_id_event.hours_per_day
      end
      puts highest_id_event.hours_remaining - highest_id_event.hours_per_day
      my_object = {
        job_id: @job.id,
        start_time: newDate,
        end_time: newDate,
        hours_per_day: new_hours_per_day,
        hours_remaining: highest_id_event.hours_remaining - highest_id_event.hours_per_day,
        color: @job.color,
        uuid: UUID.new.generate
      }
      Event.create(my_object)
      @loop_number = @loop_number - 1
    end
    render json: @job, include: :events, status: :created, location: @job
  end

  def sub
    @loop_number = params[:numb_subtract]
    while @loop_number > 0 do
      @job = Job.find(params[:id])
      highest_id_event = @job.events.max_by { |event| event.id }
      highest_id_event.destroy
      @loop_number = @loop_number - 1
    end
    # Take highest_id_event and set it's perDay = hours_remaining
    @job = Job.find(params[:id])
    highest_id_event = @job.events.max_by { |event| event.id }
    highest_id_event.hours_per_day = highest_id_event.hours_remaining
    highest_id_event.save
    render json: @job, include: :events, status: :created, location: @job
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_job
      @job = Job.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def job_params
      parameters = params.require(:job).permit(
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
        :checks
      )
      # Check if memo_boxes is present in the params and permit it
      if params[:job][:memo_boxes]
        parameters[:memo_boxes] = params[:job][:memo_boxes].permit!
      end
      # Check if :calendar is null and set it to 0 if true
      parameters[:calendar] ||= 0
      # returns parameters after adjusting
      parameters
    end
    
    def process_per_day_change
      # puts '*********************** PerDay Change ***********************'
      @foundEvent = false
      @hours_remaining = 0
      @job.events.order(:id).each do |event|
        if @foundEvent == true
          event.hours_remaining = @hours_remaining
          event.save
          @hours_remaining = event.hours_remaining - event.hours_per_day
        end
        if event.uuid == params[:eventClickedOn][:uuid]
          @foundEvent = true
          event.hours_per_day = params[:newPerDay]
          event.save
          @hours_remaining = event.hours_remaining - event.hours_per_day
        end
      end
    end

    def process_color_change
      # puts '*********************** COLOR Change ***********************'
      @job.color = params[:newColor]
      @job.save
      @job.events.order(:id).each do |event|
        event.color = params[:newColor]
        event.save
      end
    end

    def process_hours_change
      # puts '*********************** HOURS Change ***********************'
      tempPerDay = 0
      tempRemaining = params[:newHours].to_i
      @job.events.order(:id).each do |event|
        event.hours_remaining = tempRemaining
        event.save
        tempPerDay = event.hours_per_day
        tempRemaining = event.hours_remaining - tempPerDay
      end
    end
end
