Workflowy.Models.Item = Backbone.Model.extend({
  url: '/items',

  children: function() {
    return this._children = this._children || new Workflowy.Collections.Items;
  },

  parse: function(response) {
    this.children().set(
      response.children,
      {parse: true}
    );
    return response.item;
  },

  initialize: function(options) {
    this.parent = options.parent;
    Workflowy.fragment_lookup[this.get('uuid')] = this;
    Workflowy.id_lookup[this.id] = this;
  },

  shortenedNotes: function() {
    (this.notes || '') && this.notes.split(/\r?\n/, 1)[0]
  },

  aTag: function() {
    return '<a href="#' + this.get('uuid') + '">' + this.escape('title') + '</a>';
  }
});
