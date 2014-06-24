# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :view do
    user nil
    item nil
    collapsed false
    starred false
  end
end
