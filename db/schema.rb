# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_11_16_000646) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "calendars", force: :cascade do |t|
    t.string "name"
    t.integer "calendar"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "check_boxes", force: :cascade do |t|
    t.bigint "job_id", null: false
    t.string "title"
    t.boolean "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_id"], name: "index_check_boxes_on_job_id"
  end

  create_table "daily_maximums", force: :cascade do |t|
    t.integer "daily_max"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "events", force: :cascade do |t|
    t.integer "job_id"
    t.date "start_time"
    t.date "end_time"
    t.integer "hours_per_day"
    t.integer "hours_remaining"
    t.string "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "uuid"
  end

  create_table "jobs", force: :cascade do |t|
    t.string "job_name"
    t.integer "inital_hours"
    t.integer "hours_per_day"
    t.string "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "start_time"
    t.uuid "uuid"
    t.date "delivery"
    t.integer "calendar"
    t.string "status", default: "active"
    t.string "quadrent", default: "preShop"
    t.string "cut", default: "notStarted"
    t.string "weld", default: "notStarted"
    t.string "finish", default: "notStarted"
    t.date "in_hand"
    t.boolean "cnc_parts", default: false
    t.boolean "quality_control", default: false
    t.boolean "product_tag", default: false
    t.boolean "hardware", default: false
    t.boolean "powder_coating", default: false
    t.boolean "cnc_done"
    t.boolean "quality_done"
    t.boolean "product_done"
    t.boolean "hardware_done"
    t.boolean "powder_done"
  end

  create_table "memo_boxes", force: :cascade do |t|
    t.bigint "job_id", null: false
    t.string "memo"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_id"], name: "index_memo_boxes_on_job_id"
  end

  create_table "powder_colors", force: :cascade do |t|
    t.integer "job_id"
    t.string "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "check_boxes", "jobs"
  add_foreign_key "memo_boxes", "jobs"
end
