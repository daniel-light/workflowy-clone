# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :share do
    user_id 1
    item_id 1
    url nil
    can_edit nil
  end
end
