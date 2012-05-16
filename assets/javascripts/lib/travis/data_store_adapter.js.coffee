@Travis = Ember.Namespace.create() if 'undefined' is typeof @Travis

@Travis.DataStoreAdapter = DS.RESTAdapter.extend
  init: ->
    @_super()
    # TODO should be able to specify these as strings
    set 'mappings',
      builds: Travis.Build,
      commits: Travis.Commit,
      jobs: Travis.Job
      service_hooks: Travis.ServiceHook

  plurals:
    repository: 'repositories',
    branch: 'branches'

  rootForType: (type) ->
    # sorry, but @seems like complete bullshit, really
    # return type.url if (type.url)

    parts = type.toString().split('.')
    name = parts[parts.length - 1]
    name.replace(/([A-Z])/g, '_$1').toLowerCase().slice(1)

  find: (store, type, id) ->
    root = @rootForType(type)
    url = type.url || @buildURL(root, id)

    @ajax url, 'GET',
      success: (json) ->
        @sideload(store, type, json, root)
        store.load(type, json[root])

  findMany: (store, type, ids) ->
    root = @rootForType(type)
    url = type.url || @buildURL(root)
    plural = @pluralize(root)

    @ajax url, 'GET',
      data:
        ids: ids
      success: (json) ->
        @sideload(store, type, json, plural)
        store.loadMany(type, json[plural])

  findAll: (store, type) ->
    root = @rootForType(type)
    url = type.url || @buildURL(root)
    plural = @pluralize(root)

    @ajax url, 'GET',
      success: (json) ->
        @sideload(store, type, json, plural)
        store.loadMany(type, json[plural])

  findQuery: (store, type, query, recordArray) ->
    root = @rootForType(type)
    url = type.url || @buildURL(root)
    plural = @pluralize(root)

    @ajax url, 'GET',
      data: query,
      success: (json) ->
        @sideload(store, type, json, plural)
        recordArray.load(json[plural])

