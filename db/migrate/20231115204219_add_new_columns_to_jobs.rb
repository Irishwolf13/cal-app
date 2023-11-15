class AddNewColumnsToJobs < ActiveRecord::Migration[7.0]
  def change
    add_column :jobs, :cnc_done, :boolean
    add_column :jobs, :quality_done, :boolean
    add_column :jobs, :product_done, :boolean
    add_column :jobs, :hardware_done, :boolean
    add_column :jobs, :powder_done, :boolean
  end
end
