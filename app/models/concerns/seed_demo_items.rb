module SeedDemoItems
  extend ActiveSupport::Concern

  included do
    after_create :seed_demo_items
  end

  def seed_demo_items
    items.create!(rank: 1000,
      title: 'Click on an item to edit it')

    item = items.create!(rank: 2000,
      title: 'Press enter when focusing an item to create a new item')
    item.children.create!(rank: 1000,
      title: 'Press tab to indent an item')
    item.children.create!(rank: 2000,
      title: 'shift + tab will unindent an item')

    items.create!(rank: 3000,
      title: 'Return when on an empty line also unindents')

    item = items.create!(rank: 4000,
      title: 'To navigate through the document use the arrow keys')
    item.children.create!(rank: 1000,
      title: 'pressing up and down will focus the item above or below the currently selected one')

    item = items.create!(rank: 5000,
      title: 'shift + ctrl + up and shift + ctrl + down will move items around the page',
      notes: 'If you are on a mac and have launchpad shortcuts on those keys, this won\'t work')
    item.children.create!(rank: 1000,
      title: 'shift + ctrl + left and shift + ctrl + right can also be used to change indentation levels')

    items.create!(rank: 6000,
      title: 'shift + return will edit the notes for the currently focused item',
      notes: "Clicking here will also expand the notes and allow you to edit them\nThis part will be hidden until the notes are focused.\nPressing shift + return or click somewhere else will hide the full notes again.")

    item = items.create!(rank: 7000,
      title: 'When an item has nested notes')
    item.children.create!(rank: 1000,
      title: 'Everything underneath it will move with it if you move it around the page')
    item = item.children.create!(rank: 2000,
      title: 'When you create a nested item, a minus sign will appear next to its parent')
    item.children.create!(rank: 1000,
      title: 'Clicking on the minus will hide all of the nested notes')
    item = item.children.create!(rank: 2000,
      title: 'When there\'s a plus sign next to something, it can be expanded')
    item.views.create!(user: self, collapsed: true)
    item = item.children.create!(rank: 1000,
      title: 'You can nest notes as deep as you like this way')

    items.create!(rank: 8000,
      title: 'Click on an item to edit it')
  end
end