Workflowy.Views.Saved = Backbone.View.extend({
  tagName: 'li',

  initialize: function() {
    this.$el.addClass('saved');
    this.unsavedItems = new Workflowy.Collections.Items();
    this.listenTo(this.collection, 'change', this.modelChanged);
    this.listenTo(this.collection, 'sync', this.modelSynced);
  },

  render: function() {
    if (this.unsavedItems.length > 0) {
      this.$el.html('<a>Save now</a>');
    } else {
      this.$el.html('saved');
    }
    return this;
  },

  modelChanged: function(model) {
    this.unsavedItems.add(model);
    if (this.unsavedItems.length === 1) {
      this.render();
    }
  },

  modelSynced: function(model) {
    if (model instanceof Backbone.Collection) {
      return;
    }
    if (model.persisted()) {
      this.unsavedItems.remove(model);
      if (this.unsavedItems.length === 0) {
        this.render();
      }
    }
  }
});