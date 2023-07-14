class DailyMaximumsController < ApplicationController
  before_action :set_daily_maximum, only: %i[ show update destroy ]

  # GET /daily_maximums
  # GET /daily_maximums.json
  def index
    @daily_maximums = DailyMaximum.all
  end

  # GET /daily_maximums/1
  # GET /daily_maximums/1.json
  def show
  end

  # POST /daily_maximums
  # POST /daily_maximums.json
  def create
    daily_max = params[:daily_max]
    @daily_maximum = DailyMaximum.find_or_initialize_by(id: 1)

    if daily_max.present?
      @daily_maximum.daily_max = daily_max
    end

    if @daily_maximum.persisted?
      @daily_maximum.update(daily_maximum_params)
      render :show, status: :ok, location: @daily_maximum
    else
      if @daily_maximum.save
        render :show, status: :created, location: @daily_maximum
      else
        render json: @daily_maximum.errors, status: :unprocessable_entity
      end
    end
  end

  # PATCH/PUT /daily_maximums/1
  # PATCH/PUT /daily_maximums/1.json
  def update
    if @daily_maximum.update(daily_maximum_params)
      render :show, status: :ok, location: @daily_maximum
    else
      render json: @daily_maximum.errors, status: :unprocessable_entity
    end
  end

  # DELETE /daily_maximums/1
  # DELETE /daily_maximums/1.json
  def destroy
    @daily_maximum.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_daily_maximum
      @daily_maximum = DailyMaximum.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def daily_maximum_params
      params.require(:daily_maximum).permit(:daily_max)
    end
end
