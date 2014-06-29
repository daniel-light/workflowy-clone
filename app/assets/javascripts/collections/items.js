Workflowy.Collections.Items = Backbone.Collection.extend({
  url: '/items',
  model: Workflowy.Models.Item,
  comparator: 'rank',

  initialize: function(options) {
    _.extend(this, options);
  }
});
