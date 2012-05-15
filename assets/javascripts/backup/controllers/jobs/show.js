Travis.Controllers.Jobs.Show = Ember.Object.extend({
  updateTimes: function() {
    var build  = this.get('build');
    if(build) build.updateTimes();
    Ember.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
  },
