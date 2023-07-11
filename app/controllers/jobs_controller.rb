class JobsController < ApplicationController
  before_action :set_job, only: %i[ show update destroy ]

  # GET /jobs
  # GET /jobs.json
  def index
    @jobs = Job.includes(:events).all # Include all events associated with each job
    render json: @jobs
  end

  # GET /jobs/1
  # GET /jobs/1.json
  def show
    @job = Job.includes(:events).find(params[:id])
    render json: @job, include: :events
  end

  # POST /jobs
  # POST /jobs.json
  def create
    @job = Job.new(job_params)
    @job.uuid = UUID.new.generate
    @job.save

    hours_remaining = @job.inital_hours
    current_date = @job.start_time

    while hours_remaining > 0
      if !current_date.saturday? && !current_date.sunday?
        if hours_remaining - @job.hours_per_day < 0
          @job.hours_per_day = hours_remaining
        end
        my_object = {
          job_id: @job.id,
          start_time: current_date,
          end_time: current_date,
          hours_per_day: @job.hours_per_day,
          hours_remaining: hours_remaining,
          color: @job.color,
          uuid: UUID.new.generate
        }
        Event.create(my_object)
        hours_remaining -= @job.hours_per_day
      end
      current_date += 1
    end
  
    if @job.save
      render json: @job, include: :events, status: :created, location: @job
    else
      render json: @job.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /jobs/1
  # PATCH/PUT /jobs/1.json
  def update
    @job = Job.find(params[:id])
    puts '*********************** HERE ***********************'
    puts params
    @foundEvent = false
    @hours_remaining = 0
    @job.events.order(:id).each do |event|
      if @foundEvent == true
        event.hours_remaining = @hours_remaining
        event.save
        @hours_remaining = event.hours_remaining - event.hours_per_day
      end
      if event.uuid == params[:eventClickedOn][:uuid]
        puts '*********************** FOUND IT! ***********************'
        @foundEvent = true
        event.hours_per_day = params[:newPerDay]
        event.save
        @hours_remaining = event.hours_remaining - event.hours_per_day
      end
    end
    render json: @job, include: :events, status: :created, location: @job
  end

  def move
    # Retrieve the job using the id parameter
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

  # DELETE /jobs/1
  # DELETE /jobs/1.json
  def destroy
    @job = Job.find(params[:id])
    @job.destroy
  end

  def add
    @job = Job.find(params[:id])
    highest_id_event = @job.events.max_by { |event| event.id }
    puts '*********************** ADDED JOB ***********************'
    puts highest_id_event.hours_remaining
    puts highest_id_event.hours_per_day
    puts highest_id_event.start_time + 1
    my_object = {
      job_id: @job.id,
      start_time: highest_id_event.start_time + 1,
      end_time: highest_id_event.start_time + 1,
      hours_per_day: highest_id_event.hours_per_day,
      hours_remaining: highest_id_event.hours_remaining - highest_id_event.hours_per_day,
      color: @job.color,
      uuid: UUID.new.generate
    }
    Event.create(my_object)
    render json: @job, include: :events, status: :created, location: @job
  end

  def sub
    @job = Job.find(params[:id])
    highest_id_event = @job.events.max_by { |event| event.id }
    highest_id_event.destroy
    puts '*********************** SUBTRACTED JOB ***********************'
    render json: @job, include: :events, status: :created, location: @job
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_job
      @job = Job.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def job_params
      params.require(:job).permit(
        :job_name,
        :inital_hours,
        :hours_per_day,
        :color,
        :start_time,
        :uuid
      )
    end
end
