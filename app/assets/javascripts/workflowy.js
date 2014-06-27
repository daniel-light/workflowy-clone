window.Workflowy = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    var items = JSON.parse($('#bootstrapped_items_json').html()).items
    Workflowy.items = new Workflowy.Collections.Items(items, {parse: true})
  }
};

$(document).ready(function(){
  Workflowy.initialize();
});
