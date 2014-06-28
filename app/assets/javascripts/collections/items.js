Workflowy.Collections.Items = Backbone.Collection.extend({
  url: '/items',
  model: Workflowy.Models.Item,
  comparator: 'rank'
});
