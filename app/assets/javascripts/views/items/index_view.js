;(function(Workflowy) {
  "use strict";

  Workflowy.Views.Index = Backbone.View.extend({

    template: JST['items/index'],

    initialize: function() {
      this.sublist = new Workflowy.Views.List({collection: this.collection});

      this.listenTo(this.collection, 'add remove sort', this.render);
    },

    render: function() {
      this.$el.html(this.template({items: this.collection}))
      this.$el.append(this.sublist.render().$el)
      return this;
    },

    remove: function() {
      this.sublist.remove();
      return Backbone.View.prototype.remove.apply(this, arguments);
    }
  });
})(Workflowy);