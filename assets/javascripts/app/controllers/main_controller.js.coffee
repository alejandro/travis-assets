@Travis.MainController = Ember.Object.extend
  repositoryBinding: '_repositories.firstObject'
  buildsBinding: '_builds.content'
  buildBinding: '_build.content'
  branchesBinding: 'repository.branches'

  init: ->
    @_super()
    @tabs = Travis.MainStates.create()
    Ember.run.next => @initRoutes()

  initRoutes: ->
    Ember.routes.add '!/:owner/:name/jobs/:id/:line_number', (params) => @activate('job', params)
    Ember.routes.add '!/:owner/:name/jobs/:id',              (params) => @activate('job', params)
    Ember.routes.add '!/:owner/:name/builds/:id',            (params) => @activate('build', params)
    Ember.routes.add '!/:owner/:name/builds',                (params) => @activate('history', params)
    Ember.routes.add '!/:owner/:name/pull_requests',         (params) => @activate('pull_requests', params)
    Ember.routes.add '!/:owner/:name/branches',              (params) => @activate('branches', params)
    Ember.routes.add '!/:owner/:name',                       (params) => @activate('current', params)
    Ember.routes.add '',                                     (params) => @activate('current')

  activate: (tab, params) ->
    @set('params', params)
    @set('tab', tab)
    @tabs.activate(tab)

  job: (->
    Travis.Job.find(@get('params').id) if @get('tab') == 'job'
  ).property('tab')

  _repositories: (->
    slug = @get('_slug')
    if slug then Travis.Repository.bySlug(slug) else Travis.Repository.recent()
  ).property('_slug')

  _build: (->
    tab = @get('tab')
    if tab == 'current'
      Ember.Object.create(parent: @, contentBinding: 'parent.repository.lastBuild')
    else if tab == 'build'
      Ember.Object.create(parent: @, content: Travis.Build.find(@getPath('params.id')))
    else if tab == 'job'
      Ember.Object.create(parent: @, contentBinding: 'parent.job.build')
  ).property('tab')

  _builds: (->
    tab = @get('tab')
    if tab == 'history'
      Ember.Object.create(parent: @, contentBinding: 'parent.repository.builds')
    else if tab == 'builds'
      Ember.Object.create(parent: @, contentBinding: 'parent.repository.pull_requests')
  ).property('tab')

  _slug: (->
    parts = $.compact([@getPath('params.owner'), @getPath('params.name')])
    parts.join('/') if parts.length > 0
  ).property('params')


