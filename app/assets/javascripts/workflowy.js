window.Workflowy = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    Workflowy.flatItems = new Workflowy.Collections.Items({comparator: 'uuid'});

    var items = JSON.parse($('#bootstrapped_items_json').html()).items;
    Workflowy.items = new Workflowy.Collections.Items(items, {parse: true});

    savedView = new Workflowy.Views.Saved({collection: Workflowy.flatItems});
    $('.saved').replaceWith(savedView.render().$el);

    new Workflowy.Routers.Router({$rootEl: $('#content')});
    Backbone.history.start();
  }
};

$(document).ready(function(){
  Workflowy.initialize();
});
