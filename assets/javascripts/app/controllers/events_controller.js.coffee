@Travis.EventsController = Ember.Object.extend
  receive: (event, data) ->
    action = $.camelize(event.replace(':', '_'), false)
    @[action](data)

  jobCreated: (data) ->
    Travis.Job.createOrUpdate($.extend(data, state: 'created'))

  jobStarted: (data) ->
    job = Travis.Job.find(data.id)
    job.update($.extend(data, state: 'started')) if(job)

  jobLog: (data) ->
    job = Travis.Job.find(data.id)
    job.appendLog(data._log) if(job)

  jobFinished: (data) ->
    job = Travis.Job.find(data.id)
    if(job)
      job.update($.extend(data, state: 'finished'))
      job.unsubscribe() # TODO make Job listen to it's state and unsubscribe on finished

  buildStarted: (data) ->
    @updateFrom(data)

  buildFinished: (data) ->
    @updateFrom(data)

  workerAdded: (data) ->
    Travis.Worker.createOrUpdate(data)

  workerCreated: (data) ->
    Travis.Worker.createOrUpdate(data)

  workerUpdated: (data) ->
    Travis.Worker.createOrUpdate(data)

  workerRemoved: (data) ->
    worker = Travis.Worker.find(data.id)
    worker.destroy() if(worker)

  updateFrom: (data) ->
    Travis.Repository.createOrUpdate(data.repository) if(data.repository)
    Travis.Build.createOrUpdate(data.build) if(data.build)
