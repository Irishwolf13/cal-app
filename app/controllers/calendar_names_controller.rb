class CalendarNamesController < ApplicationController
  before_action :set_calendar_name, only: %i[ show update destroy ]

  # GET /calendar_names
  # GET /calendar_names.json
  def index
    @calendar_names = CalendarName.all
  end

  # GET /calendar_names/1
  # GET /calendar_names/1.json
  def show
  end

  # POST /calendar_names
  # POST /calendar_names.json
  def create
    @calendar_name = CalendarName.new(calendar_name_params)

    if @calendar_name.save
      render :show, status: :created, location: @calendar_name
    else
      render json: @calendar_name.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /calendar_names/1
  # PATCH/PUT /calendar_names/1.json
  def update
    if @calendar_name.update(calendar_name_params)
      render :show, status: :ok, location: @calendar_name
    else
      render json: @calendar_name.errors, status: :unprocessable_entity
    end
  end

  # DELETE /calendar_names/1
  # DELETE /calendar_names/1.json
  def destroy
    @calendar_name.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_calendar_name
      @calendar_name = CalendarName.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def calendar_name_params
      params.require(:calendar_name).permit(:number, :name)
    end
end
