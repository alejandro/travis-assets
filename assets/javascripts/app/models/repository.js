Travis.Repository = Travis.Model.extend(Travis.Helpers, {
  slug:                   DS.attr('string'),
  name:                   DS.attr('string'),
  owner:                  DS.attr('string'),
  description:            DS.attr('string'),
  last_build_id:          DS.attr('number'),
  last_build_number:      DS.attr('string'),
  last_build_result:      DS.attr('number'),
  last_build_duration:    DS.attr('number'),
  last_build_started_at:  DS.attr('string'),  // DateTime doesn't seem to work?
  last_build_finished_at: DS.attr('string'),

  select: function() {
    this.whenReady(function(self) {
      Travis.Repository.select(self.get('id'))
    });
  },

  updateTimes: function() {
    this.notifyPropertyChange('last_build_duration');
    this.notifyPropertyChange('last_build_finished_at');
  },

  branches: function() {
    return Travis.Branch.byRepositoryId(this.get('id'));
  }.property(),

  builds: function() {
    return Travis.Build.byRepositoryId(this.get('id'), { event_type: 'push' });
  }.property(),

  pullRequests: function() {
    return Travis.Build.byRepositoryId(this.get('id'), { event_type: 'pull_request' });
  }.property(),

  lastBuild: function() {
    return Travis.Build.find(this.get('last_build_id'));
  }.property('last_build_id'),

  // VIEW HELPERS

  color: function() {
    return this.colorForResult(this.get('last_build_result'));
  }.property('last_build_result'),

  formattedLastBuildDuration: function() {
    var duration = this.get('last_build_duration');
    if(!duration) duration = this.durationFrom(this.get('last_build_started_at'), this.get('last_build_finished_at'));
    return this.readableTime(duration);
  }.property('last_build_duration', 'last_build_started_at', 'last_build_finished_at'),

  formattedLastBuildFinishedAt: function() {
    return this.timeAgoInWords(this.get('last_build_finished_at')) || '-';
  }.property('last_build_finished_at'),

  cssClasses: function() { // ugh
    return $.compact(['repository', this.get('color'), this.get('selected') ? 'selected' : null]).join(' ');
  }.property('color', 'selected'),

  urlCurrent: function() {
    return '#!/' + this.getPath('slug');
  }.property('slug'),

  urlBuilds: function() {
    return '#!/' + this.get('slug') + '/builds';
  }.property('slug'),

  urlBranches: function() {
    return '#!/' + this.get('slug') + '/branches';
  }.property('slug'),

  urlPullRequests: function() {
    return '#!/' + this.get('slug') + '/pull_requests';
  }.property('slug'),

  urlLastBuild: function() {
    return '#!/' + this.get('slug') + '/builds/' + this.get('last_build_id');
  }.property('last_build_id'),

  urlGithub: function() {
    return 'http://github.com/' + this.get('slug');
  }.property('slug'),

  urlGithubWatchers: function() {
    return 'http://github.com/' + this.get('slug') + '/watchers';
  }.property('slug'),

  urlGithubNetwork: function() {
    return 'http://github.com/' + this.get('slug') + '/network';
  }.property('slug'),

  urlGithubAdmin: function() {
    return this.get('url') + '/admin/hooks#travis_minibucket';
  }.property('slug'),

  urlStatusImage: function() {
    return this.get('slug') + '.png'
  }.property('slug')

});

/* DS.RESTAdapter.plurals['repository'] = 'repositories' */

Travis.Repository.reopenClass({
  url: 'repositories',

  recent: function() {
    return this.all({ orderBy: 'last_build_started_at DESC' });
  },

  owned_by: function(owner_name) {
    return Travis.store.find(Ember.Query.remote(Travis.Repository, { url: 'repositories.json?owner_name=' + owner_name, orderBy: 'name' }));
  },

  search: function(search) {
    return Travis.store.find(Ember.Query.remote(Travis.Repository, { url: 'repositories.json?search=' + search, orderBy: 'name' }));
  },

  bySlug: function(slug) {
    return this.all({ slug: slug });
  },

  select: function(id) {
    this.all().forEach(function(repository) {
      repository.whenReady(function() {
        repository.set('selected', repository.get('id') == id);
      });
    });
  }
});
