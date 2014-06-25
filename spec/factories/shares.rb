# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :share do
    user nil
    item nil
    url "MyString"
    can_edit false
  end
end
