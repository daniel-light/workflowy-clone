;(function() {
  "use strict";

  window.Workflowy = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},

    initialize: function() {
      Workflowy.flatItems = new Workflowy.Collections.Items(
        [],
        {comparator: 'uuid'}
      );

      var itemsJSON = $('#bootstrapped_items_json').html();
      var items = JSON.parse(itemsJSON).items;
      Workflowy.items = new Workflowy.Collections.Items(items, {parse: true});

      var savedView = new Workflowy.Views.Saved(
        {collection: Workflowy.flatItems}
      );
      $('.saved').replaceWith(savedView.render().$el);

      key('backspace', 'main', function(event) { event.preventDefault(); });
      key.setScope('main');

      new Workflowy.Routers.Router({$rootEl: $('#content')});
      Backbone.history.start();
    },

    generateUUID: function() {
      var template = "xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx";

      var uuid = template.replace(/x/g, function() {
        return Math.floor(Math.random() * 16).toString(16);
      });

      // set the weird bit
      uuid = uuid.replace('y', function() {
        return ['8', '9', 'a', 'b'][Math.floor(Math.random() * 4)];
      });

      return uuid;
    }
  };
})();
