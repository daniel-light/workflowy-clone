;(function(Workflowy) {
  "use strict";

  Workflowy.Views.Item = Backbone.View.extend({
    tagName: 'li',
    template: JST['items/item'],

    initialize: function() {
      window.viewsCount = window.viewsCount || 0;
      window.viewsCount += 1;
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
        var selection = this.getSelection();
      }

      this.$el.find('li.item').detach();
      this.$el.html(this.template({item: this.model}));

      if (!this.model.get('collapsed')) {
        var list_section = this.$el.children('section.indented');
        list_section.html(this.sublist.render().$el);
      }

      if (selection) {
        this.restoreSelection(selection);
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

    retainFocus: function(actionFunction) {
      if (this.isBeingEdited()) {
        var selection = this.getSelection();
      }

      var result = actionFunction();

      if (selection) {
        this.restoreSelection(selection);
      }
      return result;
    },

    focus: function(field) {
      field = field || 'title';
      var selector = '.' + field;
      var el = this.$el.children(selector)[0];
      el && el.focus();
    },

    getSelection: function() {
      var selection = {};
      var range = window.getSelection().getRangeAt(0);

      selection.edited = this.isBeingEdited('title') ? '.title' : '.notes';
      selection.startOffset = range.startOffset;
      selection.endOffset = range.endOffset;

      return selection;
    },

    restoreSelection: function(selection) {
      var el = this.$el.children(selection.edited)[0];
      el.focus();

      var textNode = el.childNodes[0];
      if (!textNode) {
        return;
      }
      var range = document.createRange();
      range.setStart(textNode, selection.startOffset);
      range.setEnd(textNode, selection.endOffset);

      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
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

    bindShortcuts: function() {
      var key = function(keys, f) {
        window.key(keys, this.model.cid, f);
      }.bind(this);

      key('return', this.shortcutNewItem.bind(this));
      key('shift + ctrl + right, tab', this.shortcutIndent.bind(this));
      key('shift + ctrl + left, shift + tab', this.shortcutOutdent.bind(this));
      key('shift + return', this.shortcutSwapField.bind(this));
    },

    activateShortcuts: function(event) {
      event.stopPropagation();
      key.setScope(this.model.cid);
    },

    disableShortcuts: function(event) {
      event.stopPropagation();
      key.setScope('all');
    },

    shortcutNewItem: function(event) {
      if (!this.isBeingEdited('title')) return;
      event.preventDefault();

      var newItem = new Workflowy.Models.Item({
        parent_id: this.model && this.model.parent_id,
        uuid: Workflowy.generateUUID()
      });

      this.model.collection.insertAt(newItem, this.model.index() + 1);

      if (newItem.view) {
        newItem.view.focus();
      }
      else {
        this.listenToOnce(newItem, 'viewCreated', function(){
          newItem.view.focus();
        });
      }
    },

    shortcutSwapField: function(event) {
      event.preventDefault();

      this.isBeingEdited('title') ? this.focus('notes') : this.focus('title');
    },

    shortcutIndent: function(event) {
      event.preventDefault();
      if (!this.isBeingEdited('title')) return;

      this.model.indent();
    },

    shortcutOutdent: function(event) {
      event.preventDefault();
      if (!this.isBeingEdited('title')) return;

      this.model.outdent();
    }
  });
})(Workflowy);