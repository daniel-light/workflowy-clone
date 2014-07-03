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
        window.key(keys, this.model.cid, f.bind(this));
      }.bind(this);

      key('return', this.shortcutReturn);
      key('backspace', this.shortcutBackspace);

      key('shift + ctrl + right, tab', this.shortcutIndent);
      key('shift + ctrl + left, shift + tab', this.shortcutOutdent);
      key('shift + ctrl + up', this.shortcutMoveUp);
      key('shift + ctrl + down', this.shortcutMoveDown);

      key('shift + return', this.shortcutSwapField);
      key('up', this.shortcutFocusUp);
      key('down', this.shortcutFocusDown);
    },

    shortcutReturn: function(event) {
      if (!this.isBeingEdited('title')) return;
      event.preventDefault();

      if (this.model.title() === '' && this.isOutdentable()) {
        this.retainFocus(function() {
          this.model.outdent();
        });
      } else {
        this.createNewItem();
      }
    },

    shortcutBackspace: function(event) {
      if (this.isBeingEdited('title') && this.getSelection().startOffset === 0) {

        if (this.model.children().length > 0) {
          return;
        }

        else if (!this.model.title()) {
          event.preventDefault();

          var itemAbove = this.model.above();
          this.model.destroy();
          if (itemAbove) {
            itemAbove.view.focus();
          }
        }

        else if (this.model.leadSibling()) {
          var leadSibling = this.model.leadSibling();

          leadSibling.save({
            title: this.model.leadSibling().title() + this.model.title()
          });
          event.preventDefault();
          this.model.destroy();
          leadSibling.view.focus();
        }
      }

      else if (this.isBeingEdited('notes') && this.model.notes() === '') {
        event.preventDefault();
        this.focus('title');
      }
    },

    shortcutSwapField: function(event) {
      event.preventDefault();

      this.isBeingEdited('title') ? this.focus('notes') : this.focus('title');
    },

    shortcutIndent: function(event) {
      event.preventDefault();
      if (!this.isBeingEdited('title')) return;

      this.retainFocus(function() {
        this.model.indent();
      });
    },

    shortcutOutdent: function(event) {
      event.preventDefault();
      if (!this.isBeingEdited('title')) return;

      if (this.isOutdentable()) {
        this.retainFocus(function() {
          this.model.outdent();
        });
      }
    },

    shortcutMoveUp: function(event) {
      event.preventDefault();
      var list, newPosition;

      var neighbor = this.model.nearestNeighbor({
        traverse: this.model.leadSibling,
        pick: this.model.collection.last
      });

      if (this.model.index() > 0) {
        list = this.model.collection;
        newPosition = this.model.index() - 1;
      }

      else if (neighbor) {
        list = neighbor.collection;
        newPosition = neighbor.index() + 1;
      }

      else {
        return;
      }

      this.retainFocus(function() {
        this.model.collection.remove(this.model);
        list.insertAt(this.model, newPosition);
      });
    },

    shortcutMoveDown: function(event) {
      event.preventDefault();
      var list, newPosition;

      var neighbor = this.model.nearestNeighbor({
        traverse: this.model.tailSibling,
        pick: this.model.collection.first
      });

      if (this.model.index() < this.model.collection.length - 1) {
        list = this.model.collection;
        newPosition = this.model.index() + 1;
      }

      else if (neighbor) {
        newPosition = neighbor.index();
      }

      else {
        return;
      }

      this.retainFocus(function() {
        this.model.collection.remove(this.model);
        list.insertAt(this.model, newPosition);
      });
    },

    shortcutFocusUp: function(event) {
      event.preventDefault();

      var itemAbove = this.model.above();
      if (itemAbove) itemAbove.view.focus();
    },

    shortcutFocusDown: function(event) {
      event.preventDefault();

      var itemBelow = this.model.below();
      if (itemBelow) itemBelow.view.focus();
    },

    setDragopolis: function() {
      this.$el.droppable({
        hoverClass: 'draggable-hover',
        greedy: true
      });

      this.$el.draggable({
        handle: '.bullet',
        helper: function() {
          return this.$el.children('.bullet');
        }.bind(this),

        cursorAt: {top: 10, left: 10}
      });
    }
  });
})(Workflowy);