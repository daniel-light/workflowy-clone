;(function(Workflowy) {
  "use strict";

  Workflowy.Views.Item = Backbone.View.extend({
    tagName: 'li',
    template: JST['items/item'],

    initialize: function() {
      this.$el.addClass('item');
      this.$el.data('uuid', this.model.get('uuid'));

      this.sublist = new Workflowy.Views.List({
        collection: this.model.children()
      });

      this.bindShortcuts();
      this.listenTo(this.model, 'change', this.render);
    },

    events: {
      'click .collapser': 'toggleCollapsed', // select this more precisely?
      'input .title': 'changeTitle',
      'focus .notes': 'expandNotes',
      'blur .notes': 'collapseNotes',
      'input .notes': 'changeNotes',
      'focus p': 'activateShortcuts',
      'blur p': 'disableShortcuts'
    },

    render: function() {
      if (this.isBeingEdited()) {
        var selection = this.getSelectedPosition();
      }

      this.$el.find('li.item').detach();
      this.$el.html(this.template({item: this.model}));

      if (!this.model.get('collapsed')) {
        var list_section = this.$el.children('section.indented');
        list_section.html(this.sublist.render().$el);
      }

      if (selection) {
        this.restoreSelectedPosition(selection);
      }

      return this;
    },

    remove: function() {
      this.sublist.remove();
      return Backbone.View.prototype.remove.apply(this, arguments);
    },

    isBeingEdited: function(input) {
      if (input) {
        input = '.' + input;
      } else {
        input = '';
      }
      return this.$el.children('p' + input + ':focus').length > 0;
    },

    toggleCollapsed: function() {
      event.stopPropagation();
      this.model.toggleCollapsed();
    },

    changeTitle: function(event) {
      event.stopPropagation();
      this.model.title($(event.currentTarget).text());
    },

    changeNotes: function(event) {
      event.stopPropagation();
      this.model.notes(event.currentTarget.innerText); //TODO firefox support
    },

    expandNotes: function(event) {
      event.stopPropagation();
      event.currentTarget.innerHTML = this.model.escape('notes');
    },

    collapseNotes: function(event) {
      event.stopPropagation();
      event.currentTarget.innerHTML = this.model.shortenedNotes();
    },

    activateShortcuts: function(event) {
      event.stopPropagation();
      key.setScope(this.model.cid);
    },

    disableShortcuts: function(event) {
      event.stopPropagation();
      key.setScope('all');
    },

    bindShortcuts: function() {
      var key = function(keys, f) {
        window.key(keys, this.model.cid, f);
      }.bind(this);

      key('return', this.shortcutNewItem.bind(this));
      key('shift + ctrl + right, tab', this.shortcutIndent.bind(this));
    },

    shortcutNewItem: function(event) {
      event.preventDefault();
      if (!this.isBeingEdited('title')) return;

      var newItem = new Workflowy.Models.Item({
        parent_id: this.model && this.model.parent_id,
        uuid: Workflowy.generateUUID()
      });

      this.model.collection.insertAt(newItem, this.model.index() + 1);
    },

    shortcutIndent: function(event) {
      event.preventDefault();

      this.model.indent();
    },

    getSelectedPosition: function() {
      var selection = {};
      var range = window.getSelection().getRangeAt(0);

      selection.edited = this.isBeingEdited('title') ? '.title' : '.notes';
      selection.startOffset = range.startOffset;
      selection.endOffset = range.endOffset;
      console.log(range);
      window.range = range;
      window.container = selection.startContainer;

      return selection;
    },

    restoreSelectedPosition: function(selection) {
      var el = this.$el.children(selection.edited)[0];
      el.focus();

      var textNode = el.childNodes[0];
      var range = document.createRange();
      range.setStart(textNode, selection.startOffset);
      range.setEnd(textNode, selection.endOffset);

      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  });
})(Workflowy);