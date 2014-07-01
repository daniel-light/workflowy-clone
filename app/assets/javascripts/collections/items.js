;(function(Workflowy) {
  "use strict";

  Workflowy.Collections.Items = Backbone.Collection.extend({
    url: function() {
      if (this.parent) {
        return '/items/' + this.parent.get('uuid');
      } else {
        return '/items'
      }
    },

    model: Workflowy.Models.Item,
    comparator: 'rank',
    _rankIncrement: 100,

    initialize: function(models, options) {
      if (options) {
        this.parent = options.parent;
      }
    },

    insertAt: function(item, position) {
      var newRank = this._rankForPosition(position);
      item.collection = this;

      if (newRank !== parseInt(newRank)) {
        console.log('oh', newRank)
        item.set('rank', position * this._rankIncrement);
        this._rerank(function() {
          item.save({}, {
            success: function(item, attributes) {
              item.set(attributes, {parse: true})
            }
          });
        this.add(item);
        }.bind(this));
      }

      else {
        console.log('eh')
        item.set('rank', newRank);
        this.add(item);
        item.save({}, {
          success: function(item, attributes) {
            item.set(attributes, {parse: true})
          },

          error: function() { console.log(arguments) }
        });
      }
    },

    _rankForPosition: function(position) {
      if (position < 0) {
        return this.last().get('rank') + this._rankIncrement;
      }
      var lowRank = this.at(position - 1) && this.at(position - 1).get('rank'),
          highRank = this.at(position) && this.at(position).get('rank'),
          newRank;
          console.log(lowRank, highRank)
      if (lowRank === undefined) {
        newRank = parseInt(highRank / 2);
      } else if (highRank === undefined) {
        newRank = lowRank + this._rankIncrement;
      } else {
        newRank = parseInt((lowRank + highRank) / 2);
      }

      if (newRank === lowRank || newRank === highRank) {
        newRank += .5;
      }

      return newRank;
    },

    _rerank: function(callback) {
      var rankMap = {};
      this.forEach(function(item, index) {
        item.set('rank', (index + 1) * this._rankIncrement);
        rankMap[item.get('id')] = item.get('rank');
      }.bind(this));

      $.ajax({
        url: this.url() + '/rerank',
        type: 'patch',
        contentType: 'application/json',
        data: JSON.stringify({ranks: rankMap}),
        success: callback
      });
    }
  });
})(Workflowy);