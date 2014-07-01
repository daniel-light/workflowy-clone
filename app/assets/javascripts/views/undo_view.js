Workflowy.Views.Undo = Backbone.Views.extend({
  tag: 'li',

  initialize: function() {
    this._undos = [];
    key.bind('ctrl + z', 'all', this.undo.bind(this));
    this._redos = [];
    key.bind('shift + ctrl + z', 'all', this.redo.bind(this));

    this.listenTo(this.collection, 'change:title', recordTitleChange);
    this.listenTo(this.collection, 'change:notes', recordNotesChange);
    this.listenTo(this.collection, 'add', recordAdd);
    this.listenTo(this.collection, 'remove', recordRemove);
    this.listenTo(this.colleciton, 'destroy', recordDestroy);
  },

  events: {
    'click .undo': 'undo',
    'click .redo': 'redo'
  },

  undo: function() {
  },

  redo: function() {
  },

  recordTitleChange: function(item, title, options) {
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