class CreateJobs < ActiveRecord::Migration[7.0]
  def change
    create_table :jobs do |t|
      t.string :job_name
      t.integer :inital_hours
      t.integer :hours_per_day
      t.string :color

      t.timestamps
    end
  end
end
