@Travis.Job = Travis.Model.extend Travis.Helpers,
  repository_id:   DS.attr('number')
  build_id:        DS.attr('number')
  state:           DS.attr('string')
  number:          DS.attr('string')
  result:          DS.attr('number')
  started_at:      DS.attr('string')
  finished_at:     DS.attr('string')
  allow_failure:   DS.attr('boolean')

  repository: DS.belongsTo('Travis.Repository')
  commit: DS.belongsTo('Travis.Commit')

  config: (->
    @getPath 'data.config'
  ).property('data.config')

  log: (->
    @subscribe()
    log = @getPath('data.log')
    @refresh()  if log is `undefined`
    log || ''
  ).property('data.log')

  duration: (->
    @durationFrom @get('started_at'), @get('finished_at')
  ).property('started_at', 'finished_at')

  # update: (attrs) ->
  #   build = @get('build')
  #   if build
  #     job = build.get('jobs').find (job) ->
  #       job.get('id') is @get('id')
  #     job.update(attrs) if job
  #   @_super attrs

  # appendLog: (log) ->
  #   @set 'log', @get('log') + log

  subscribe: ->
    id = @get('id')
    Travis.app.unsubscribeAll /^job-/  if id
    Travis.app.subscribe 'job-' + id

  tick: ->
    @notifyPropertyChange 'duration'
    @notifyPropertyChange 'finished_at'

  url: (->
    '#!/%@/jobs/%@'.fmt @getPath('repository.slug'), @get('id')
  ).property('repository', 'id')

@Travis.Job.reopenClass
  queued: (queue) ->
    @all(state: 'created', queue: 'builds.' + queue)
