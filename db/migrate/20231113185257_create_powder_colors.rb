class CreatePowderColors < ActiveRecord::Migration[7.0]
  def change
    create_table :powder_colors do |t|
      t.integer :job_id
      t.string :color

      t.timestamps
    end
  end
end
