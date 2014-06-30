Workflowy.Views.Item = Backbone.View.extend({
  tagName: 'li',
  template: JST['items/item'],

  initialize: function() {
    this.$el.addClass('item');
    this.$el.data('uuid', this.model.get('uuid'));

    this.sublist = new Workflowy.Views.List({
      collection: this.model.children()
    });

    this.bindShortcuts();
    this.listenTo(this.model, 'change', this.render);
  },

  events: {
    'click .collapser': 'toggleCollapsed', // select this more precisely?
    'input .title': 'changeTitle',
    'focus .notes': 'expandNotes',
    'blur .notes': 'collapseNotes',
    'input .notes': 'changeNotes',
    'focus p': 'activateShortcuts',
    'blur p': 'disableShortcuts'
  },

  render: function() {
    // don't interrupt the user
    if (this.isBeingEdited()) {
      return this;
    }

    this.$el.find('li.item').detach();
    this.$el.html(this.template({item: this.model}));

    if (!this.model.get('collapsed')) {
      var list_section = this.$el.children('section.indented');
      list_section.html(this.sublist.render().$el);
    }
    return this;
  },

  remove: function() {
    this.sublist.remove();
    return Backbone.View.prototype.remove.apply(this, arguments);
  },

  isBeingEdited: function(input) {
    if (input) {
      input = '.' + input;
    } else {
      input = '';
    }
    return this.$el.children('p' + input + ':focus').length > 0;
  },

  toggleCollapsed: function() {
    this.model.toggleCollapsed();
  },

  changeTitle: function(event) {
    event.stopPropagation();
    this.model.title($(event.currentTarget).text());
  },

  changeNotes: function(event) {
    event.stopPropagation();
    this.model.notes(event.currentTarget.innerText); //TODO firefox support
  },

  expandNotes: function(event) {
    event.stopPropagation();
    event.currentTarget.innerHTML = this.model.escape('notes');
  },

  collapseNotes: function(event) {
    event.stopPropagation();
    event.currentTarget.innerHTML = this.model.shortenedNotes();
  },

  activateShortcuts: function(event) {
    event.stopPropagation();
    console.log('active', this.model.title())
    key.setScope(this.model.get('uuid'));
  },

  disableShortcuts: function(event) {
    event.stopPropagation();
    console.log('disactive')
    key.setScope('all');
  },

  bindShortcuts: function() {
    key('return', this.model.get('uuid'), this.shortcutNewItem.bind(this));
  },

  shortcutNewItem: function(event, handler) {
    if (!this.isBeingEdited('title')) return;

    event.preventDefault();
  }
});