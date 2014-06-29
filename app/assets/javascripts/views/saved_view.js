Workflowy.Views.Saved = Backbone.View.extend({
  tagName: 'li',

  initialize: function() {
    this.$el.addClass('savedsss');
  },

  render: function() {
    this.$el.text('saved');
    return this;
  }
});