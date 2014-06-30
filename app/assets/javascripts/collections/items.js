Workflowy.Collections.Items = Backbone.Collection.extend({
  url: '/items',
  model: Workflowy.Models.Item,
  comparator: 'rank',

  initialize: function(models, options) {
    if (options) {
      this.parent = options.parent;
    }
  },

  rankForPosition: function(position) {
    if (position < 0) {
      return this.last().get('rank') + 100;
    }
    var lowRank = this.at(position - 1) && this.at(position - 1).get('rank'),
        highRank = this.at(position) && this.at(position).get('rank');

    if (lowRank === undefined) {
      return parseInt(highRank / 2);
    } else if (highRank === undefined) {
      return lowRank + 100;
    } else {
      return parseInt((lowRank + highRank) / 2);
    }
  }
});
