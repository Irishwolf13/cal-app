class CalendarsController < ApplicationController
  before_action :set_calendar, only: %i[ show update destroy ]

  def index
    @calendars = Calendar.all
  
    if @calendars.empty?
      @calendar = Calendar.create(name: 'Default Calendar', calendar: 0)
      @calendars = [@calendar]
    end
  end

  # def show
  # end

  def create
    @calendars = Calendar.all
  
    if @calendars.empty?
      calendar_value = 0
    else
      calendar_value = @calendars.length
    end
    @calendar = Calendar.new(name: "New Calendar", calendar: calendar_value)
  
    if @calendar.save
      render :show, status: :created, location: @calendar
    else
      render json: @calendar.errors, status: :unprocessable_entity
    end
  end

  def update
    if @calendar.update(calendar_params)
      render :show, status: :ok, location: @calendar
    else
      render json: @calendar.errors, status: :unprocessable_entity
    end
  end

  def destroy
  @calendar = Calendar.find(params[:id])

  if @calendar.calendar == 0
    render json: { error: "Cannot delete calendar with :calendar = 0" }, status: :unprocessable_entity
  else
    @calendar.destroy
    head :no_content
  end
end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_calendar
      @calendar = Calendar.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def calendar_params
      params.require(:calendar).permit(:name, :calendar)
    end
end
