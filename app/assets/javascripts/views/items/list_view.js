;(function(Workflowy) {
  "use strict";

  Workflowy.Views.List = Backbone.View.extend({
    tagName: 'ul',

    initialize: function() {
      this.$el.addClass('list');

      this.collection.forEach(function(item) {
        item.view = new Workflowy.Views.Item({model: item});
      });

      this.listenTo(this.collection, 'remove sort', this.render);
      this.listenTo(this.collection, 'add', this.addNewItemView);
    },

    render: function() {
      this.$el.children().detach();

      this.collection.forEach(function(item) {
        item.view.delegateEvents();
        this.$el.append(item.view.render().$el);
      }.bind(this));

      return this;
    },

    remove: function() {
      this.collection.forEach(function(item) {
        item.view.remove();
      });
      return Backbone.View.prototype.remove.apply(this, arguments);
    },

    addNewItemView: function(item) {
      item.view = new Workflowy.Views.Item({model: item});
      this.render();
      item.trigger('viewCreated');
    }
  });
})(Workflowy);