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
      key('shift + ctrl + up', this.shortcutMoveUp.bind(this));
      key('shift + ctrl + down', this.shortcutMoveDown.bind(this));
      key('shift + return', this.shortcutSwapField.bind(this));
      key('backspace', this.shortcutBackspace.bind(this));
    },

    shortcutReturn: function(event) {
      if (!this.isBeingEdited('title')) return;
      event.preventDefault();

      if (this.model.title() === '' && this.isOutdentable()) {
        this.model.outdent();
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

          var next = this.model.leadSibling() || this.model.collection.parent;
          this.model.destroy();
          if (next) {
            next.view.focus();
          }
        }

        else if (this.model.leadSibling()) {
          var leadSibling = this.model.leadSibling();

          leadSibling.save({
            title: this.model.leadSibling().title() + this.model.title()
          })
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
      }.bind(this));
    },

    shortcutOutdent: function(event) {
      event.preventDefault();
      if (!this.isBeingEdited('title')) return;

      if (this.isOutdentable()) {
        this.retainFocus(function() {
          this.model.outdent();
        }.bind(this));
      }
    },

    shortcutMoveUp: function(event) {
      event.preventDefault();
      var list = this.model.collection,
          newPosition;

      if (this.model.leadSibling()) {
        newPosition = this.model.index() - 1;
      }
      else {
        var stepsUp = 0;

        while (list.parent) {
          if (list.parent.leadSibling()) {

            list = list.parent.leadSibling().children();
            while (list.length && stepsUp) {
              list = list.last().children();
              --stepsUp;
            }

            newPosition = list.length;
            break;
          }
          else {
            list = list.parent.collection;
            ++stepsUp;
          }
        }
      }

      if (typeof newPosition === 'number') {
        this.retainFocus(function() {
          this.model.collection.remove(this.model);
          list.insertAt(this.model, newPosition);
        }.bind(this));
      }
    },

    shortcutMoveDown: function(event) {
      event.preventDefault();
      var list = this.model.collection,
          newPosition;

      if (this.model.tailSibling()) {
        newPosition = this.model.index() + 1;
      }
      else {
        var stepsUp = 0;

        while (list.parent) {
          if (list.parent.tailSibling()) {

            list = list.parent.tailSibling().children();
            while (list.length && stepsUp) {
              list = list.first().children();
              --stepsUp;
            }

            newPosition = 0;
            break;
          }
          else {
            list = list.parent.collection;
            ++stepsUp;
          }
        }
      }

      if (typeof newPosition === 'number') {
        this.retainFocus(function() {
          this.model.collection.remove(this.model);
          list.insertAt(this.model, newPosition);
        }.bind(this));
      }
    }
  });
})(Workflowy);