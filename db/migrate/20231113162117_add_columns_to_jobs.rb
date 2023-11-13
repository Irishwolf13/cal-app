class AddColumnsToJobs < ActiveRecord::Migration[7.0]
  def change
    add_column :jobs, :in_hand, :date
    add_column :jobs, :cnc_parts, :boolean
    add_column :jobs, :quality_control, :boolean
    add_column :jobs, :product_tag, :boolean
    add_column :jobs, :hardware, :boolean
    add_column :jobs, :powder_coating, :boolean
  end
end
