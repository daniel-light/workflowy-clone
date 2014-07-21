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
      this.set({
        title: this.get('title') || '',
        notes: this.get('notes') || ''
      });

      this.listenTo(this, 'change', this.updateChangeTime);
      this.listenTo(this, 'sync', this.updateSyncTime);
    },

    children: function() {
      if (!this._children) {
        this._children =  new Workflowy.Collections.Items([], {parent: this});
      }
      return this._children;
    },

    parent: function() {
      return this.collection.parent;
    },

    parse: function(response) {
      Workflowy.flatItems.add(this);

      if (response.children) {
        this.children().set(
          response.children,
          {parse: true}
        );

        delete response.children;
      }

      return response.item;
    },

    toJSON: function() {
      return _.omit(this.attributes, 'collapsed');
    },

    destroy: function() {
      this.children().forEach(function(item) {
        item.destroy();
      });

      Backbone.Model.prototype.destroy.apply(this, arguments);
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

      if (lines[0].length < notes.length) {
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

    toggleCollapsed: function() {
      if (this.children().isEmpty()) return;
      this.set('collapsed', !this.get('collapsed'));

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
      if (value === undefined) return this.get('title');

      if (value !== this.get('title')) {
        this.save({title: value}, {
          patch: true,
          success: function() {
          }
        });
      }
      return this.get('title');
    },

    notes: function(value) {
      if (value === undefined) return this.get('title');

      if (value !== this.get('notes')) {
        this.save({notes: value}, {
          patch: true,
          success: function() {
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
    },

    outdent: function() {
      if (
        !this.collection ||
        !this.collection.parent ||
        !this.collection.parent.collection
      ) {
          throw "Item cannot be outdented";
      }

      var position = this.collection.parent.index() + 1;
      var newCollection = this.collection.parent.collection;
      this.collection.remove(this);
      newCollection.insertAt(this, position);

    },

    nearestNeighbor: function(options) {
      var traverse = options.traverse,
          pick = options.pick;

      var stepsUp = -1;
      var ancestor = this._walkUpUntil(function(item) {
        ++stepsUp;
        return !!traverse.call(item);
      });

      if (!ancestor) {
        return null;
      }
      var newAncestor = traverse.call(ancestor);
      return newAncestor._leaf(pick, stepsUp);
    },

    above: function() {
      if (this.leadSibling()) {
        return this.leadSibling()._leaf(this.collection.last);
      }

      else {
        return this.collection.parent;
      }
    },

    below: function() {
      if (this.children().length > 0) {
        return this.children().first();
      }

      else {
        var ancestor = this._walkUpUntil(function(item) {
          return !!item.tailSibling();
        });
        return ancestor ? ancestor.tailSibling() : null;
      }
    },

    _leaf: function(step, maxSteps) {
      var item = this,
          list = this.children();

      while (list && (maxSteps === undefined || maxSteps)) {
        if (maxSteps) --maxSteps;

        if (step.call(list)) {
          item = step.call(list);
          list = item.children();
        } else {
          list = null;
        }
      }

      return item;
    },

    _walkUpUntil: function(condition) {
      if (condition(this)) {
        return this;
      }
      else if (!this.collection.parent) {
        return null;
      }
      else {
        return this.collection.parent._walkUpUntil(condition);
      }
    }
  });
})(Workflowy);
