class RemoveCheckMeAndCheckDoneFromCheckBoxes < ActiveRecord::Migration[7.0]
  def change
    remove_column :check_boxes, :check_me, :boolean
    remove_column :check_boxes, :check_done, :boolean
  end
end
