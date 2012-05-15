Travis.Branch = Travis.Model.extend(Travis.Helpers, {
  repository_id:   DS.attr('number'),
  number:          DS.attr('number'),
  branch:          DS.attr('string'),
  message:         DS.attr('string'),
  result:          DS.attr('number'),
  duration:        DS.attr('number'),
  started_at:      DS.attr('string'), // use DateTime?
  finished_at:     DS.attr('string'),

  commit: DS.belongsTo('Travis.Commit'),

  repository: function() {
    if(this.get('repository_id')) return Travis.Repository.find(this.get('repository_id'));
  }.property('repository_id').cacheable(),

  // VIEW HELPERS

  buildUrl: function() {
    return '#!/' + this.getPath('repository.slug') + '/builds/' + this.get('build_id');
  }.property(),

  commitUrl: function() {
    return 'http://github.com/' + this.getPath('repository.slug') + '/commit/' + this.getPath('commit.sha');
  }.property(),
});

Travis.Branch.reopenClass({
  byRepositoryId: function(id) {
    return this.all({ repository_id: id });
  }
});
