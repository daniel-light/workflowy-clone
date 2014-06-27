Workflowy.Routers.Router = Backbone.Router.extend({
  routes: {
    '': 'index'
  },

  initialize: function(options) {
    this.$rootEl = options.$rootEl;
  },

  index: function() {
    var view = new Workflowy.Views.ItemsIndex({collection: Workflowy.items});
    this._swapView(view);
  },

  _swapView: function(newView) {
    this._currentView && this._currentView.remove();
    this._currentView = newView;
    this.$rootEl.html(newView.render().$el);
  }
});
