class MemoBoxesController < ApplicationController
  before_action :set_memo_box, only: [:show, :update, :destroy]

  # GET /memo_boxes
  def index
    @memo_boxes = MemoBox.all
    render json: @memo_boxes
  end

  # GET /memo_boxes/1
  def show
    render json: @memo_box
  end

  # POST /memo_boxes
  def create
    @memo_box = MemoBox.new(params)
    if @memo_box.save
      render json: @memo_box, status: :created, location: @memo_box
    else
      render json: @memo_box.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /memo_boxes/1
  def update
    if @memo_box.update(memo_box_params)
      render json: @memo_box
    else
      render json: @memo_box.errors, status: :unprocessable_entity
    end
  end

  # DELETE /memo_boxes/1
  def destroy
    @memo_box.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_memo_box
    @memo_box = MemoBox.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def memo_box_params
    params.require(:memo_box).permit(:memo, :job_id)
  end
end