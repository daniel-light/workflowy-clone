# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :item do
    user_id 1
    sequence(:rank) { |n| n }
    title "title"
  end
end
