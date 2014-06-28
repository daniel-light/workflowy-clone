Workflowy.Views.ItemView = Backbone.View.extend({
  tagName: 'li',
  template: JST['items/item'],

  initialize: function() {
    this.$el.addClass('item');
    this.$el.data('id', this.model.get('uuid'));

    this.sublist = new Workflowy.Views.ListView({
      collection: this.model.children()
    });

    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {
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
  }
});