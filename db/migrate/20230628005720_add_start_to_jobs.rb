class AddStartToJobs < ActiveRecord::Migration[7.0]
  def change
    add_column :jobs, :start, :date
  end
end
