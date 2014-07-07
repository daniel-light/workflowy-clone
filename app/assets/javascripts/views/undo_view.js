;(function(Workflowy) {
  "use strict";

  Workflowy.Views.Undo = Backbone.View.extend({
    tag: 'li',

    initialize: function() {
      this.$el.addClass('undos');

      this._undos = [];
      key('ctrl + z', 'all', this.undo.bind(this));
      this._redos = [];
      key('shift + ctrl + z', 'all', this.redo.bind(this));

      this.listenTo(this.collection, 'change:title', this.recordTitleChange);
      this.listenTo(this.collection, 'change:notes', this.recordNotesChange);
      this.listenTo(this.collection, 'add', this.recordAdd);
      this.listenTo(this.collection, 'remove', this.recordRemove);
      this.listenTo(this.collection, 'destroy', this.recordDestroy);
    },

    render: function() {
      this.$el.html(
        '<li class="undo"><a>undo</a></li>' +
        '<li class="redo"><a>redo</a></li>'
      )
      return this;
    },

    events: {
      'click .undo': 'undo',
      'click .redo': 'redo'
    },

    undo: function() {
      if (this._undos.length === 0) return;
      event.preventDefault();

      var action = this._undos.pop();
      action.undo();
      this._redos.push(action);

      if (this._redos.length === 1) {
        this.$el.children('.redo').addClass('usable')
      }
      if (this._undos.length === 0) {
        this.$el.children('.undo').removeClass('usable');
      }
    },

    redo: function() {
      if (this._undos.length === 0) return;
      event.preventDefault();

      var action = this._redos.pop();
      action.redo();
      this.pushUndo(action);

      if (this._redos.length === 0) {
        this.$el.children('.redo').removeClass('usable');
      }
    },

    pushUndo: function(action) {
      this._undos.push(action);
      if (this._undos.length === 1) {
        this.$el.children('.undo').addClass('usable');
      }
    },

    recordTitleChange: function(item, title, options) {
      if (options.undoIgnore) return;

      var action = {
        _previous: item.previous('title'),
        _current: item.get('title'),
        _time: new Date(),

        undo: function() {
          item.set('title', this._previous, {undoIgnore: true});
          item.save();
        },

        redo: function() {
          item.set('title', this._current, {undoIgnore: true});
          item.save();
        }
      };

      this.pushUndo(action);
    },

    recordNotesChange: function(item, notes, options) {
    },

    recordAdd: function(item, list, options) {
    },

    recordRemove: function(item, list, options) {
    },

    recordDestroy: function(item, list, options) {
    }
  });
})(Workflowy);