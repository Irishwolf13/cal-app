class CreateCalendars < ActiveRecord::Migration[7.0]
  def change
    create_table :calendars do |t|
      t.string :name
      t.integer :calendar

      t.timestamps
    end
  end
end
