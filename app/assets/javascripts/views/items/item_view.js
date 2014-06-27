Workflowy.Views.ItemView = Backbone.View.extend({
  tagName: 'li',
  template: JST['items/item'],

  initialize: function() {
    this.$el.addClass('item');
    this.$el.data('id', this.model.get('uuid'));
  },

  render: function() {
    this.$el.html(this.template({item: this.model}));
    return this;
  }
});