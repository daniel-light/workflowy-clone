# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :item do
    user nil
    parent_id 1
    rank 1
    title "MyText"
    notes "MyText"
  end
end
