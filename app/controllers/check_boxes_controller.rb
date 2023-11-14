class CheckBoxesController < ApplicationController
  before_action :set_check_box, only: [:show, :update, :destroy]

  # GET /check_boxes
  # GET /check_boxes.json
  def index
    @check_boxes = CheckBox.all
  end

  # GET /check_boxes/1
  # GET /check_boxes/1.json
  def show
  end

  # POST /check_boxes
  # POST /check_boxes.json
  def create
    @check_box = CheckBox.new(parms)

    if @check_box.save
      render :show, status: :created, location: @check_box
    else
      render json: @check_box.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /check_boxes/1
  # PATCH/PUT /check_boxes/1.json
  def update
    if @check_box.update(check_box_params)
      render :show, status: :ok, location: @check_box
    else
      render json: @check_box.errors, status: :unprocessable_entity
    end
  end

  # DELETE /check_boxes/1
  # DELETE /check_boxes/1.json
  def destroy
    @check_box.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_check_box
      @check_box = CheckBox.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def check_box_params
      params.require(:check_box).permit(:job_id, :title, :status)
    end
end
