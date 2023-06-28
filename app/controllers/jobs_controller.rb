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
  end

  # POST /jobs
  # POST /jobs.json
  def create
    @job = Job.new(job_params)
    puts "************ HERE ******************"
    hours_remaining = @job.inital_hours
    current_date = @job.start
    while hours_remaining > 0
      if current_date.saturday? || current_date.sunday?
        puts "WEEKEND"
        puts "@job.start: #{current_date}"
      else
        puts "WEEK DAY"
        puts "@job.start: #{current_date}"
      end
      current_date += 1
      hours_remaining -= @job.hours_per_day
    end

    # puts job_params

    # if @job.save
    #   render :show, status: :created, location: @job
    # else
    #   render json: @job.errors, status: :unprocessable_entity
    # end
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
        :start
      )
    end
end
