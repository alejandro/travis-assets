Travis.Job = Travis.Model.extend(Travis.Helpers, {
  repository_id:   DS.attr('number'),
  build_id:        DS.attr('number'),
  // config:          DS.attr('object'),
  state:           DS.attr('string'),
  number:          DS.attr('string'),
  commit:          DS.attr('string'),
  branch:          DS.attr('string'),
  message:         DS.attr('string'),
  result:          DS.attr('number'),
  started_at:      DS.attr('string'), // use DateTime?
  finished_at:     DS.attr('string'),
  committed_at:    DS.attr('string'),
  committer_name:  DS.attr('string'),
  committer_email: DS.attr('string'),
  author_name:     DS.attr('string'),
  author_email:    DS.attr('string'),
  compare_url:     DS.attr('string'),
  allow_failure:   DS.attr('boolean'),

  repository: DS.belongsTo('Travis.Repository'),
  // build:      DS.belongsTo('Travis.Build'),
  commit:     DS.belongsTo('Travis.Commit'),

  // TODO how to define a DS.attr that returns an object?
  config: function() {
    return this.getPath('data.config') || '';
  }.property('data.config'),

  log: function() {
    var log = this.getPath('data.log');
    if(log === undefined) this.refresh();
    return log;
  }.property('data.log'),

  // TODO ...
  duration: function() {
    return this.durationFrom(this.get('started_at'), this.get('finished_at'));
  }.property('started_at', 'finished_at'),

  update: function(attrs) {
    var build = this.get('build');
    if(build) build.whenReady(function(build) {
      var job = build.get('jobs').find(function(job) { return job.get('id') == this.get('id') });
      if(job) { job.update(attrs); }
    });
    this._super(attrs);
  },

  appendLog: function(log) {
    this.set('log', this.get('log') + log);
  },

  subscribe: function() {
    var id = this.get('id');
    if(id && !this._subscribed) {
      this._subscribed = true;
      Travis.subscribe('job-' + id);
    }
  },

  unsubscribe: function() {
    this._subscribed = false;
    Travis.unsubscribe('job-' + this.get('id'));
  },

  updateTimes: function() {
    this.notifyPropertyChange('duration');
    this.notifyPropertyChange('finished_at');
  },

  // VIEW HELPERS

  url: function() {
    return '#!/' + this.getPath('repository.slug') + '/jobs/' + this.get('id');
  }.property('repository', 'id'),
});

Travis.Job.reopenClass({
});
