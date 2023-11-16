class AddDoneToCheckBoxes < ActiveRecord::Migration[7.0]
  def change
    add_column :check_boxes, :done, :boolean
  end
end
