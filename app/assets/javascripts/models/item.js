;(function(Workflowy) {
  "use strict";

  Workflowy.Models.Item = Backbone.Model.extend({
    url: function() {
      if (this.isNew()) {
        if (this.collection && this.collection.parent) {
          return this.collection.parent.url();
        } else {
          return '/items';
        }
      }
      return '/items/' + this.get('uuid');
    },

    initialize: function() {
      this.listenTo(this, 'change', this.updateChangeTime);
      this.listenTo(this, 'sync', this.updateSyncTime);
    },

    children: function() {
      if (!this._children) {
        this._children =  new Workflowy.Collections.Items([], {parent: this});
      }
      return this._children;
    },

    parse: function(response) {
      Workflowy.flatItems.add(this);

      if (response.children) {
        this.children().set(
          response.children,
          {parse: true}
        );
      }

      return response.item;
    },

    toJSON: function(options) {
      return _.omit(this.attributes, 'collapsed');
    },

    updateChangeTime: function() {
      this._changeTime = new Date();
    },

    updateSyncTime: function() {
      this._syncTime = new Date();
    },

    persisted: function() {
      if (this.isNew()) {
        return false;
      } else if (this._changeTime === undefined) {
        return true;
      } else if (this._syncTime === undefined) {
        return false;
      }
      return this._syncTime.getTime() >= this._changeTime.getTime();
    },

    shortenedNotes: function() {
      var notes = this.escape('notes') || '';
      var lines = notes.split(/\r?\n/, 1);

      if (lines.length < notes.length) {
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
          window.response = response;
          this.set('collapsed', response.collapsed);
        }.bind(this)
      });
    },

    title: function(value) {
      if (value !== undefined && value != this.get('title')) {
        this.save({title: value}, {
          patch: true,
          success: function() {
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
        this.save({notes: value}, {
          patch: true,
          success: function() {
          },
          error: function() {
            //TODO flash an error message
          }
        });
      }
      return this.get('notes') || '';
    },

    index: function() {
      return this.collection.indexOf(this);
    },

    leadSibling: function() {
      return this.collection.at(this.index() - 1);
    },

    tailSibling: function() {
      return this.collection.at(this.index() + 1);
    },

    indent: function() {
      if (!this.leadSibling()) return;

      var newCollection = this.leadSibling().children();
      this.collection.remove(this);
      newCollection.insertAt(this, -1);
    }
  });
})(Workflowy);
