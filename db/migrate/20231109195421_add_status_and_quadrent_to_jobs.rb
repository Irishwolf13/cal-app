class AddStatusAndQuadrentToJobs < ActiveRecord::Migration[6.0]
  def change
    add_column :jobs, :status, :string, default: "active"
    add_column :jobs, :quadrent, :string, default: "preShop"
  end
end