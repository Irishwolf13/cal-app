class ChangeCalendarToIntegerInJobs < ActiveRecord::Migration[7.0]
  def up
    change_column :jobs, :calendar, 'integer USING calendar::integer'
  end

  def down
    change_column :jobs, :calendar, :string
  end
end