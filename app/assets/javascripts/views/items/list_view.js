Workflowy.Views.ListView = Backbone.View.extend({
  tagName: 'ul',

  initialize: function() {
    this.$el.addClass('list');

    this.itemViews = this.collection.map(function(item) {
      return new Workflowy.Views.ItemView({model: item});
    });

    this.listenTo(this.collection, 'add remove sort', this.render);
  },

  render: function() {
    this.$el.children().detach();

    this.itemViews.forEach(function(itemView) {
      this.$el.append(itemView.render().$el);
    }.bind(this));

    return this;
  },

  remove: function() {
    this.itemViews.forEach(function(itemView) {
      itemView.remove();
    });
    return Backbone.View.prototype.remove.apply(this, arguments);
  }
});