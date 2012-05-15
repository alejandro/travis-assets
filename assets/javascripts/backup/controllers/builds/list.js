Travis.Controllers.Builds.List = Ember.ArrayController.extend({
  updateTimes: function() {
    var builds  = this.get('builds');
    if(builds) {
      $.each(builds, function(ix, build) { build.updateTimes(); }.bind(this));
    }
    Ember.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
  },
