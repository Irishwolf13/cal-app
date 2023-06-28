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
    @job.save

    hours_remaining = @job.inital_hours
    current_date = @job.start_time

    while hours_remaining > 0
      if !current_date.saturday? || !current_date.sunday?
        if hours_remaining - @job.hours_per_day < 0
          @job.hours_per_day = hours_remaining
        end
        my_object = {
          job_id: @job.id,
          start_time: current_date,
          end_time: current_date,
          hours_per_day: @job.hours_per_day,
          hours_remaining: hours_remaining,
          color: @job.color
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
    if @job.update(job_params)
      render :show, status: :ok, location: @job
    else
      render json: @job.errors, status: :unprocessable_entity
    end
  end

  # DELETE /jobs/1
  # DELETE /jobs/1.json
  def destroy
    @job.destroy
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
        :start_time
      )
    end
end
