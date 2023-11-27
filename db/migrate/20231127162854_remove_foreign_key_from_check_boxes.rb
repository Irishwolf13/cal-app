class RemoveForeignKeyFromCheckBoxes < ActiveRecord::Migration[7.0]
  def change
    # Adjust :jobs and :check_boxes with the correct table names if they are different.
    # If there is more than one foreign key, specify the name of the foreign key you want to remove.
    remove_foreign_key :check_boxes, :jobs
  end
end