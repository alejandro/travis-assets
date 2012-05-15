Travis.Build = Travis.Model.extend(Travis.Helpers, {
  repository_id:   DS.attr('number'),
  // config:          DS.attr('object'),
  state:           DS.attr('string'),
  number:          DS.attr('number'),
  branch:          DS.attr('string'),
  message:         DS.attr('string'),
  result:          DS.attr('number'),
  duration:        DS.attr('number'),
  started_at:      DS.attr('string'), // use DateTime?
  finished_at:     DS.attr('string'),
  committed_at:    DS.attr('string'),
  committer_name:  DS.attr('string'),
  committer_email: DS.attr('string'),
  author_name:     DS.attr('string'),
  author_email:    DS.attr('string'),
  compare_url:     DS.attr('string'),
  log:             DS.attr('string'),

  repository: DS.belongsTo('Travis.Repository'),
  commit:     DS.belongsTo('Travis.Commit'),

  // TODO jobs needs to be implemented in a lazy loading manner
  jobs:       DS.hasMany('Travis.Job', { key: 'job_ids' }),

  // TODO how to define a DS.attr that returns an object?
  config: function() {
    return this.getPath('data.config')
  }.property('data.config'),

  requiredJobs: function() {
    return this.get('jobs').filter(function(item, index) { return item.get('allow_failure') != true });
  }.property('jobs'),

  allowFailureJobs: function() {
    return this.get('jobs').filter(function(item, index) { return item.get('allow_failure') });
  }.property('jobs'),

  hasFailureMatrix: function() {
    return this.get('allowFailureJobs').length > 0;
  }.property('allowFailureJobs'),

  isMatrix: function() {
    return this.getPath('jobs.length') > 1;
  }.property('jobs.length'),

  update: function(attrs) {
    if('jobs' in attrs) attrs.jobs = this._joinJobsAttributes(attrs.jobs);
    this._super(attrs);
  },

  // We need to join given attributes with existing attributes because DS.Model.toMany
  // does not seem to allow partial updates, i.e. would remove existing attributes?
  _joinJobsAttributes: function(attrs) {
    var _this = this;
    return $.each(attrs, function(ix, job) {
      var _job = _this.get('jobs').objectAt(ix);
      if(_job) attrs[ix] = $.extend(_job.get('attributes') || {}, job);
    });
  },

  tick: function() {
    this.notifyPropertyChange('duration');
    this.notifyPropertyChange('finished_at');
  },

  // VIEW HELPERS

  url: function() {
    return '#!/' + this.getPath('repository.slug') + '/builds/' + this.get('id');
  }.property('repository.status', 'id'),

  urlAuthor: function() {
    return 'mailto:' + this.get('author_email');
  }.property('author_email'),

  urlCommitter: function() {
    return 'mailto:' + this.get('committer_email');
  }.property('committer_email'),

  urlGithubCommit: function() {
    return 'http://github.com/' + this.getPath('repository.slug') + '/commit/' + this.get('commit');
  }.property('repository.slug', 'commit')
});

Travis.Build.reopenClass({
  byRepositoryId: function(id, parameters) {
    return this.all($.extend(parameters || {}, { repository_id: id, orderBy: 'number DESC' }));
  },

  // TODO ugh. better naming?
  olderThanNumber: function(id, build_number) {
    return this.all({ url: '/repositories/' + id + '/builds.json?bare=true&after_number=' + build_number, repository_id: id, orderBy: 'number DESC' });
  }
});
