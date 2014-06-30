window.Workflowy = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    Workflowy.flatItems = new Workflowy.Collections.Items([], {comparator: 'uuid'});

    var items = JSON.parse($('#bootstrapped_items_json').html()).items;
    Workflowy.items = new Workflowy.Collections.Items(items, {parse: true});

    savedView = new Workflowy.Views.Saved({collection: Workflowy.flatItems});
    $('.saved').replaceWith(savedView.render().$el);

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

$(document).ready(function(){
  Workflowy.initialize();
});