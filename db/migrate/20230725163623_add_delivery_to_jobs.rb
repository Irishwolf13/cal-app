class AddDeliveryToJobs < ActiveRecord::Migration[7.0]
  def change
    add_column :jobs, :delivery, :date
  end
end
