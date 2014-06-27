Workflowy.Models.Item = Backbone.Model.extend({
  url: '/items',

  children: function() {
    return this._children = this._children || new Workflowy.Collections.Items;
  },

  parse: function(response) {
    this.children().set(response.children, {parse: true, parent: this});
    return response.item;
  },

  initialize: function(options) {
    this.parent = options.parent;
  }
});
