class AddDefaultValuesToColumnsInJobs < ActiveRecord::Migration[6.0]
  def change
    change_column_default :jobs, :in_hand, nil
    change_column_default :jobs, :cnc_parts, false
    change_column_default :jobs, :quality_control, false
    change_column_default :jobs, :product_tag, false
    change_column_default :jobs, :hardware, false
    change_column_default :jobs, :powder_coating, false
  end
end
