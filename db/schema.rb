# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140624142227) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "items", force: true do |t|
    t.integer  "user_id"
    t.integer  "parent_id"
    t.integer  "rank"
    t.text     "title"
    t.text     "notes"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "items", ["user_id", "parent_id", "rank"], name: "index_items_on_user_id_and_parent_id_and_rank", unique: true, using: :btree

  create_table "users", force: true do |t|
    t.string   "email",           null: false
    t.string   "password_digest", null: false
    t.string   "session_token",   null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["session_token"], name: "index_users_on_session_token", unique: true, using: :btree

  create_table "views", force: true do |t|
    t.integer  "user_id",    null: false
    t.integer  "item_id"
    t.boolean  "collapsed",  null: false
    t.boolean  "starred",    null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "views", ["user_id", "item_id"], name: "index_views_on_user_id_and_item_id", unique: true, using: :btree

end
