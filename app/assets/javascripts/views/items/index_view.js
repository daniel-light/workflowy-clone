Workflowy.Views.IndexView = Backbone.View.extend({

  template: JST['items/index'],

  initialize: function() {
    this.sublist = new Workflowy.Views.ListView({collection: this.collection});
  },

  render: function() {
    this.$el.html(this.template({items: this.collection}))
    this.$el.append(this.sublist.render().$el)
    return this;
  },

  remove: function() {
    this.sublist.remove();
    return Backbone.View.prototype.remove.apply(this, arguments);
  }
});
