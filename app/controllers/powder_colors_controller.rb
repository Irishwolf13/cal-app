class PowderColorsController < ApplicationController
  before_action :set_powder_color, only: %i[ show update destroy ]

  # GET /powder_colors
  # GET /powder_colors.json
  def index
    @powder_colors = PowderColor.all
  end

  # GET /powder_colors/1
  # GET /powder_colors/1.json
  def show
  end

  # POST /powder_colors
  # POST /powder_colors.json
  def create
    @powder_color = PowderColor.new(powder_color_params)

    if @powder_color.save
      render :show, status: :created, location: @powder_color
    else
      render json: @powder_color.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /powder_colors/1
  # PATCH/PUT /powder_colors/1.json
  def update
    if @powder_color.update(powder_color_params)
      render :show, status: :ok, location: @powder_color
    else
      render json: @powder_color.errors, status: :unprocessable_entity
    end
  end

  # DELETE /powder_colors/1
  # DELETE /powder_colors/1.json
  def destroy
    @powder_color.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_powder_color
      @powder_color = PowderColor.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def powder_color_params
      params.require(:powder_color).permit(:job_id, :color)
    end
end
