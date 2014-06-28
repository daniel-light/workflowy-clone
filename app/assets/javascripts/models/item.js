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
    Workflowy.lookup.fragment[this.get('uuid')] = this;
    Workflowy.lookup.id[this.id] = this;
  },

  toJSON: function(options) {
    return _.omit(this, 'collapsed');
  },

  shortenedNotes: function() {
    return (this.get('notes') || '') && this.get('notes').split(/\r?\n/, 1)[0];
  },

  aTag: function() {
    var uuid = this.get('uuid');
    var title = this.escape('title');

    return '<a href="#' + uuid + '">' + title + '</a>';
  },

  // do not record this into undoable actions or mark the document as unsaved
  toggleCollapsed: function() {
    this.set('collapsed', !this.get('collapsed'))

    $.ajax({
      url: this.url() + '/collapse',
      type: 'patch',

      success: function(response) {
        this.set('collapsed', response.collapsed);
      }.bind(this)
    });
  }
});
