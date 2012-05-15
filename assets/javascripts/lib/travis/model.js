if('undefined' === typeof window.Travis) window.Travis = Ember.Namespace.create()

window.Travis.Model = DS.Model.extend({
  primaryKey: 'id',
  id: DS.attr('number'),

  refresh: function() {
    var id = this.get('id');
    if(id) return Travis.app.store.adapter.find(Travis.app.store, this.constructor, id);
  }

  // update: function(attrs) {
  //   this.whenReady(function(record) {
  //     $.each(attrs, function(key, value) {
  //       if(key != 'id') record.set(key, value);
  //     });
  //   });
  //   return this;
  // },
});

window.Travis.Model.reopenClass({
  find: function(id, callback) {
    if(id === undefined) throw('id is undefined');
    return Travis.app.store.find(this, id);
  },

  all: function(query) {
    return Travis.app.store.find(this, query);
  }

  // exists: function(id) {
  //   if(id === undefined) throw('id is undefined');
  //   return Travis.store.storeKeyExists(this, id);
  // },

  // createOrUpdate: function(attrs) {
  //   if(this.exists(attrs.id)) {
  //     return this.update(attrs);
  //   } else {
  //     return Travis.store.createRecord(this, attrs);
  //   }
  // },

  // update: function(attrs) {
  //   if(attrs.id === undefined) throw('id is undefined');
  //   var record = this.find(attrs.id);
  //   return record.update(attrs);
  // },
});
