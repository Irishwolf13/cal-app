class CreateEvents < ActiveRecord::Migration[7.0]
  def change
    create_table :events do |t|
      t.integer :job_id
      t.date :start
      t.date :end
      t.integer :hours_per_day
      t.integer :hours_remaining
      t.string :color

      t.timestamps
    end
  end
end
