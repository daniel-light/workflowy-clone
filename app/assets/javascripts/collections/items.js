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
      item.set('parent_id', this.parent && this.parent.id);

      if (newRank !== parseInt(newRank)) {
        item.set('rank', position * this._rankIncrement);
        this._rerank(function() {
          item.save({}, {
            success: function(item, attributes) {
              item.set(attributes, {parse: true})
            }
          });
        }.bind(this));
        this.add(item);
      }

      else {
        item.set('rank', newRank);
        this.add(item);
        item.save({}, {
          success: function(item, attributes) {
            item.set(attributes, {parse: true})
          }
        });
      }
    },

    _rankForPosition: function(position) {
      if (position < -1) throw new UserException('invalid rank specified');

      if (position === -1) {
        var lastRank = this.last() ? this.last().get('rank') : 0;
        return lastRank + this._rankIncrement;
      }

      var lowRank = this.at(position - 1) && this.at(position - 1).get('rank'),
          highRank = this.at(position) && this.at(position).get('rank');

      return this._rankBetween(lowRank, highRank);
    },

    _rankBetween: function(lowRank, highRank) {
      var newRank;

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