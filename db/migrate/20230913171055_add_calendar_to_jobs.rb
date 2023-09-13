class AddCalendarToJobs < ActiveRecord::Migration[7.0]
  def change
    add_column :jobs, :calendar, :string
  end
end
