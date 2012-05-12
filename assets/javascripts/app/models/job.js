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
  // log:             DS.attr('string'),
  allow_failure:   DS.attr('boolean'),

  repository: DS.belongsTo('Travis.Repository'),
  // build:      DS.belongsTo('Travis.Build'),
  commit:     DS.belongsTo('Travis.Commit'),

  // repository: function() {
  //   return Travis.Repository.find(this.get('repository_id'));
  // }.property('repository_id'),

  // build: function() {
  //   if(window.__DEBUG__) console.log('updating build on job ' + this.get('id'));
  //   return Travis.Build.find(this.get('build_id'));
  // }.property('build_id'),

  log: function() {
    var log = this.getPath('data.log');
    if(log === undefined) this.refresh();
    return log;
  }.property('data.log'),

  update: function(attrs) {
    var build = this.get('build');
    if(build) build.whenReady(function(build) {
      var job = build.get('jobs').find(function(job) { return job.get('id') == this.get('id') });
      if(job) { job.update(attrs); }
    });
    this._super(attrs);
  },

  subscribe: function() {
    var id = this.get('id');
    if(id && !this._subscribed) {
      this._subscribed = true;
      Travis.subscribe('job-' + id);
    }
  },

  appendLog: function(log) {
    this.set('log', this.get('log') + log);
  },

  unsubscribe: function() {
    this._subscribed = false;
    Travis.unsubscribe('job-' + this.get('id'));
  },

  updateTimes: function() {
    this.notifyPropertyChange('duration');
    this.notifyPropertyChange('finished_at');
  },

  color: function() {
    return this.colorForResult(this.get('result'));
  }.property('result'),

  duration: function() {
    return this.durationFrom(this.get('started_at'), this.get('finished_at'));
  }.property('finished_at'),

  // VIEW HELPERS

  formattedDuration: function() {
    return this._formattedDuration();
  }.property('duration'),

  formattedFinishedAt: function() {
    return this._formattedFinishedAt();
  }.property('finished_at'),

  formattedConfig: function() {
    return this._formattedConfig();
  }.property('config'),

  formattedConfigValues: function() {
    var values = $.values($.only(this.getPath('config'), 'rvm', 'gemfile', 'env', 'otp_release', 'php', 'node_js', 'scala', 'jdk', 'python', 'perl'));
    return $.map(values, function(value) {
      return Ember.Object.create({ value: value })
    });
  }.property(),

  formattedLog: function() {
    var log = this.getPath('log');
    return log ? Travis.Log.filter(log) : '';
  }.property('log'),

  formattedMessage: function(){
    return this._formattedMessage();
  }.property('commit.message'),

  formattedCommit: function() {
    return this._formattedCommit()
  }.property('commit.sha', 'commit.branch'),

  formattedCompareUrl: function() {
    return this._formattedCompareUrl();
  }.property('commit.compare_url'),

  url: function() {
    return '#!/' + this.getPath('repository.slug') + '/jobs/' + this.get('id');
  }.property('repository', 'id'),
});

Travis.Job.reopenClass({
  resource: 'jobs'
});

