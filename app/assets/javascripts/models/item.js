Workflowy.Models.Item = Backbone.Model.extend({
  url: function() {
    return '/items/' + this.get('uuid');
  },

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

  toJSON: function(options) {
    return _.omit(this, 'collapsed');
  },

  shortenedNotes: function() {
    (this.notes || '') && this.notes.split(/\r?\n/, 1)[0]
  },

  aTag: function() {
    return '<a href="#' + this.get('uuid') + '">' + this.escape('title') + '</a>';
  },

  // do not record this into undoable actions or mark the document as unsaved
  toggleCollapsed: function() {
    console.log('collapsing', this.get('collapsed'), this.id);
    this.set('collapsed', !this.get('collapsed'))
    $.ajax({
      url: this.url() + '/collapse',
      type: 'patch',
      success: function(response) {
        console.log('collapsed', response)
        this.set('collapsed', response.collapsed);
      }.bind(this),
      error: function(response) { console.log(response) }
    });
  }
});
