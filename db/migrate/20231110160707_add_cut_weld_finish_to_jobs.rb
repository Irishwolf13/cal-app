class AddCutWeldFinishToJobs < ActiveRecord::Migration[7.0]
  def change
    add_column :jobs, :cut, :string
    add_column :jobs, :weld, :string
    add_column :jobs, :finish, :string
  end
end
