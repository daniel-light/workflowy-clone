;(function(Workflowy) {
  "use strict";

  Workflowy.Views.Show = Backbone.View.extend({
    template: JST['items/show'],

    initialize: function() {
      this.$el.addClass('page');

      this.sublist = new Workflowy.Views.List({
        collection: this.model.children()
      });

      this.listenTo(this.model, 'change', this.render);
    },

    events: {
      'input .title': 'changeTitle',
      'input .notes': 'changeNotes'
    },

    render: function() {
      var html = this.template({
        item: this.model,
        breadcrumbs: this.breadcrumbs()
      });

      this.$el.children('.padded').html(html);
      this.$el.find('article').html(this.sublist.render().$el);

      return this;
    },

    remove: function() {
      this.sublist.remove();
      return Backbone.View.prototype.remove.apply(this, arguments);
    },

    breadcrumbs: function() {
      var breadcrumbs = [];
      var item = this.model;

      while (item) {
        //item = Workflowy.lookup.id[item.get('parent_id')];
        item = item.collection.parent;
        if (item) {
          breadcrumbs.unshift(item.aTag());
        } else {
          breadcrumbs.unshift('<a href="#">Home</a>');
        }
      }

      return breadcrumbs.join(' > ');
    },

    changeTitle: function(event) {
      event.stopPropagation();
      this.model.title($(event.currentTarget).text());
    },

    changeNotes: function(event) {
      event.stopPropagation();
      this.model.notes(event.currentTarget.innerText);
    }
  });
})(Workflowy);