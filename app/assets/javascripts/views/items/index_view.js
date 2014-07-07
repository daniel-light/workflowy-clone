;(function(Workflowy) {
  "use strict";

  Workflowy.Views.Index = Backbone.View.extend({

    template: JST['items/index'],

    initialize: function() {
      this.$el.addClass('page');

      this.sublist = new Workflowy.Views.List({collection: this.collection});
      this.listenTo(this.collection, 'add remove sort', this.render);
    },

    events: {
      'click .new': 'addInitialItem'
    },

    render: function() {
      this.$el.html(this.template({items: this.collection}));
      this.$el.children('.padded').append(this.sublist.render().$el);

      if (this.collection.length === 0) {
        this.$el.children('.padded').html('<a class="new">+</a>');
      }
      return this;
    },

    remove: function() {
      this.sublist.remove();
      return Backbone.View.prototype.remove.apply(this, arguments);
    },

    addInitialItem: function() {
      var newItem = this.collection.createAt(0);

      if (newItem.view) {
        newItem.view.focus();
      }
      else {
        this.listenToOnce(newItem, 'viewCreated', function(){
          newItem.view.focus();
        });
      }
    }
  });
})(Workflowy);