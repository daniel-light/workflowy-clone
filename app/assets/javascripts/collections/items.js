Workflowy.Collections.Items = Backbone.Collection.extend({
  urlRoot: '/items',
  model: Workflowy.Models.Item,
  comparator: 'rank'
});
