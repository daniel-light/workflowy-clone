Workflowy.Views.List = Backbone.View.extend({
  tagName: 'ul',

  initialize: function() {
    this.$el.addClass('list');

    this.itemViews = this.collection.map(function(item) {
      return new Workflowy.Views.Item({model: item});
    });

    this.listenTo(this.collection, 'remove sort', this.render);
    this.listenTo(this.collection, 'add', this.addNewItem);
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
  },

  addNewItem: function(item) {
    var newItemView = new Workflowy.Views.Item({model: item});
    this.itemViews.push(newItemView);
    this.$el.append(newItemView.render().$el);
  }
});