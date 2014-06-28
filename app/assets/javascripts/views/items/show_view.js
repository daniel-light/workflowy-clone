Workflowy.Views.ShowView = Backbone.View.extend({

  template: JST['items/show'],

  initialize: function() {
    this.sublist = new Workflowy.Views.ListView({
      collection: this.model.children()
    });
    this.breadcrumbs = this._generateBreadcrumbs(this.model);


    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {
    var html = this.template({
      item: this.model,
      breadcrumbs: this.breadcrumbs
    });

    this.$el.html(html);
    this.$el.find('article').html(this.sublist.render().$el);

    return this;
  },

  remove: function() {
    this.sublist.remove();
    return Backbone.View.prototype.remove.apply(this, arguments);
  },

  _generateBreadcrumbs: function(item) {
    var breadcrumbs = [];

    while (item) {
      console.log(breadcrumbs)
      item = Workflowy.id_lookup[item.get('parent_id')];
      if (item) {
        breadcrumbs.unshift(item.aTag());
      } else {
        breadcrumbs.unshift('<a href="#">Home</a>');
      }
    }

    return breadcrumbs.join(' > ');
  }
});
