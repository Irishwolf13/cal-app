class ChangeStartEndColumnNames < ActiveRecord::Migration[6.0]
  def change
    rename_column :events, :start, :start_time
    rename_column :events, :end, :end_time

    rename_column :jobs, :start, :start_time
  end
end