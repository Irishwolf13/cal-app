class CreateDailyMaximums < ActiveRecord::Migration[7.0]
  def change
    create_table :daily_maximums do |t|
      t.integer :daily_max

      t.timestamps
    end
  end
end
