class ChecksController < ApplicationController
  before_action :set_check, only: %i[ show update destroy ]

  # GET /checks
  # GET /checks.json
  def index
    @checks = Check.all
  end

  # GET /checks/1
  # GET /checks/1.json
  def show
  end

  # POST /checks
  # POST /checks.json
  def create
    @check = Check.new(check_params)

    if @check.save
      render :show, status: :created, location: @check
    else
      render json: @check.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /checks/1
  # PATCH/PUT /checks/1.json
  def update
    if @check.update(check_params)
      render :show, status: :ok, location: @check
    else
      render json: @check.errors, status: :unprocessable_entity
    end
  end

  # DELETE /checks/1
  # DELETE /checks/1.json
  def destroy
    @check.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_check
      @check = Check.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def check_params
      params.require(:check).permit(:title, :status, :done, :job_id)
    end
end
