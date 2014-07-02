;(function(Workflowy) {
  "use strict";

  Workflowy.Views.Item = Workflowy.Views.Item || Backbone.View.extend();
  _.extend(Workflowy.Views.Item.prototype, {

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
      this.listenTo(this.model, 'destroy', this.remove);
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

    retainFocus: function(action) {
      if (this.isBeingEdited()) {
        var selection = this.getSelection();
      }

      var result = action.call(this);

      if (selection) {
        this.restoreSelection(selection);
      }
      return result;
    },

    focus: function(field, offset) {
      field = field || 'title';
      offset = offset || this.model.title().length;

      var selection = {
        edited: '.' + field,
        startOffset: offset,
        endOffset: offset
      }

      this.restoreSelection(selection);
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

    isOutdentable: function() {
      // Don't outdent if
      //   - we are the item being shown
      //   - we are in the top level list of the whole document
      //   - we are nested directly underneath the item being shown
      return (
        this.model.view &&
        this.model.collection.parent &&
        this.model.collection.parent.view
      );
    },

    createNewItem: function() {
      if (this.model.title() !== '' && this.getSelection().startOffset === 0) {
        var position = this.model.index();
      } else {
        var position = this.model.index() + 1;
      }

      var newItem = this.model.collection.createAt(position);

      if (newItem.view) {
        newItem.view.focus();
      }
      else {
        this.listenToOnce(newItem, 'viewCreated', function(){
          newItem.view.focus();
        });
      }
    }
  });
})(Workflowy);