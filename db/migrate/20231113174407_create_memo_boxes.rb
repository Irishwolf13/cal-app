class CreateMemoBoxes < ActiveRecord::Migration[7.0]
  def change
    create_table :memo_boxes do |t|
      t.references :job, null: false, foreign_key: true
      t.string :memo

      t.timestamps
    end
  end
end
