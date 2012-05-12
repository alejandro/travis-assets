@Travis.Views =
  Layouts:
    Default: Ember.View.extend
      templateName: 'app/templates/layouts/default'
      repositoryBinding: 'Travis.app.main.repository'
      buildBinding: 'Travis.app.main.build'
      buildsBinding: 'Travis.app.main.builds'
      jobBinding: 'Travis.app.main.job'
      branchesBinding: 'Travis.app.main.branches'
  Repositories:
    Show: Ember.View.extend
      templateName: 'app/templates/repositories/show'
    List: Ember.View.extend
      templateName: 'app/templates/repositories/list'
    Branches: Ember.View.extend
      templateName: 'app/templates/repositories/branches'
    Tab: Ember.CollectionView
  Builds:
    Show: Ember.View.extend
      templateName: 'app/templates/builds/show'
    List: Ember.View.extend
      templateName: 'app/templates/builds/list'
  Jobs:
    Show: Ember.View.extend
      templateName: 'app/templates/jobs/show'

