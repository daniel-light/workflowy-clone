Workflowy.Routers.Router = Backbone.Router.extend({
  routes: {
    '': 'index',
    ':uuid': 'show'
  },

  initialize: function(options) {
    this.$rootEl = options.$rootEl;
  },

  index: function() {
    var view = new Workflowy.Views.IndexView({collection: Workflowy.items});
    this._swapView(view);
  },

  show: function(uuid) {
    var item = Workflowy.fragment_lookup[uuid];
    var view = new Workflowy.Views.ShowView({model: item});
    this._swapView(view);
  },

  _swapView: function(newView) {
    this._currentView && this._currentView.remove();
    this._currentView = newView;
    this.$rootEl.html(newView.render().$el);
  }
});
