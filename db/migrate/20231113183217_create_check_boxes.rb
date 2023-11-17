class CreateCheckBoxes < ActiveRecord::Migration[7.0]
  def change
    create_table :check_boxes do |t|
      t.references :job, null: false, foreign_key: true
      t.string :title
      t.boolean :status
      t.boolean :done
      t.string :wtf

      t.timestamps
    end
  end
end
