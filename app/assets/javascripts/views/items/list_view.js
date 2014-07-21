;(function(Workflowy) {
  "use strict";

  Workflowy.Views.List = Backbone.View.extend({
    tagName: 'ul',

    initialize: function() {
      window.viewCount = window.viewCount || 0;
      window.viewCount += 1;
      this.$el.addClass('list');

      this.listenTo(this.collection, 'remove sort', this.render);
      this.listenTo(this.collection, 'add', this.addNewItemView);
    },

    render: function() {
      this.$el.children().detach();

      this.collection.forEach(function(item) {
        if (!item.view) item.view = new Workflowy.Views.Item({model: item});
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
      if (!item.view) {
        item.view =  new Workflowy.Views.Item({model: item});
        item.trigger('viewCreated');
      }
      this.render();
    }
  });
})(Workflowy);
