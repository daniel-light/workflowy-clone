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
    var notes = this.escape('notes') || '';
    var lines = notes.split(/\r?\n/, 1);

    if (lines.length > 1) {
      return lines[0] + '...';
    } else {
      return lines[0];
    }
  },

  aTag: function() {
    var uuid = this.get('uuid');
    var title = this.escape('title');

    return '<a href="#' + uuid + '">' + title + '</a>';
  },

  // do not record this into undoable actions or mark the document as unsaved
  toggleCollapsed: function() {
    if (this.children().isEmpty()) return;
    this.set('collapsed', !this.get('collapsed'))

    $.ajax({
      url: this.url() + '/collapse',
      type: 'patch',

      success: function(response) {
        this.set('collapsed', response.collapsed);
      }.bind(this)
    });
  },

  title: function(value) {
    if (value !== null && value != this.get('title')) {
      //TODO set undoable and unsaved
      this.save({title: value}, {
        silent: true,
        patch: true,
        success: function() {
          //TODO clear saved
        },
        error: function() {
          //TODO flash an error message
        }
      });
    }
    return this.get('title');
  },

  notes: function(value) {
    if (value !== undefined && value != this.get('notes')) {
      //TODO set undoable and unsaved
      this.save({notes: value}, {
        silent: true,
        patch: true,
        success: function() {
          //TODO clear saved
        },
        error: function() {
          //TODO flash an error message
        }
      });
    }
    return this.get('notes') || '';
  }
});
