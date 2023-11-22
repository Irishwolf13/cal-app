class CreateChecks < ActiveRecord::Migration[7.0]
  def change
    create_table :checks do |t|
      t.string :title
      t.boolean :status
      t.boolean :done
      t.references :job, null: false, foreign_key: true

      t.timestamps
    end
  end
end
