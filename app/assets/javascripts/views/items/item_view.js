Workflowy.Views.Item = Backbone.View.extend({
  tagName: 'li',
  template: JST['items/item'],

  initialize: function() {
    this.$el.addClass('item');
    this.$el.data('uuid', this.model.get('uuid'));

    this.sublist = new Workflowy.Views.List({
      collection: this.model.children()
    });

    this.listenTo(this.model, 'change', this.render);
  },

  events: {
    'click .collapser': 'toggleCollapsed', // select this more precisely?
    'input .title': 'changeTitle',
    'focus .notes': 'expandNotes',
    'blur .notes': 'collapseNotes',
    'input .notes': 'changeNotes'
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

  isBeingEdited: function() {
    return this.$el.children('p:focus').length > 0;
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
  }
});