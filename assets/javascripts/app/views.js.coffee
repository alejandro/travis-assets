@Travis.Views =
  Layouts:
    Default: Ember.View.extend
      templateName: 'app/templates/layouts/default'
      repositoriesBinding: 'Travis.app.left'
      repositoryBinding: 'Travis.app.main.repository'
      buildBinding: 'Travis.app.main.build'
      buildsBinding: 'Travis.app.main.builds'
      jobBinding: 'Travis.app.main.job'
      branchesBinding: 'Travis.app.main.branches'
    Main: Ember.View.extend
      templateName: 'app/templates/layouts/_main'
    Left: Ember.View.extend
      templateName: 'app/templates/layouts/_left'
      click: (event)->
        # TODO this is being triggered twice?
        # TODO this is being triggered when the searchbox is clicked? wtf.
        id = $(event.srcElement).closest('.tabs li').attr('id')
        Travis.app.left.activate(id.replace('tab_', '')) if id

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

