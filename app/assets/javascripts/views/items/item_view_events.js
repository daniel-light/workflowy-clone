;(function(Workflowy) {
  "use strict";

  Workflowy.Views.Item = Workflowy.Views.Item || Backbone.View.extend();
  _.extend(Workflowy.Views.Item.prototype, {

    events: {
      'click .collapser': 'toggleCollapsed', // select this more precisely?
      'input .title': 'changeTitle',
      'focus .notes': 'expandNotes',
      'blur .notes': 'collapseNotes',
      'input .notes': 'changeNotes',
      'focus p': 'activateShortcuts',
      'blur p': 'disableShortcuts'
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

      key('return', this.shortcutReturn.bind(this));
      key('shift + ctrl + right, tab', this.shortcutIndent.bind(this));
      key('shift + ctrl + left, shift + tab', this.shortcutOutdent.bind(this));
      key('shift + return', this.shortcutSwapField.bind(this));
    },

    shortcutReturn: function(event) {
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

      if (this.isOutdentable()) {
        this.model.outdent();
      }
    }
  });
})(Workflowy);