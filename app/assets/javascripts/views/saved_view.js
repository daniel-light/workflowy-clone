Workflowy.Views.Saved = Backbone.View.extend({
  tagName: 'li',

  initialize: function() {
    this.$el.addClass('saved');

    this.listenTo(this.collection, 'add remove', this.render);
  },

  render: function() {
    if (this.collection.length > 0) {
      this.$el.html('<a>Save now</a>');
    } else {
      this.$el.html('saved');
    }
    return this;
  }
});