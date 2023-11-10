class ChangeDefaultForColumnName < ActiveRecord::Migration[6.0]
  def change
    change_column_default :jobs, :cut, 'notStarted'
    change_column_default :jobs, :weld, 'notStarted'
    change_column_default :jobs, :finish, 'notStarted'
  end
end