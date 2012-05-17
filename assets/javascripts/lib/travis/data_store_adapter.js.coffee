@Travis = Ember.Namespace.create() if 'undefined' is typeof @Travis

@Travis.DataStoreAdapter = DS.RESTAdapter.extend
  init: ->
    @_super()
    # TODO should be able to specify these as strings
    @set 'mappings',
      builds: Travis.Build,
      commits: Travis.Commit,
      jobs: Travis.Job
      service_hooks: Travis.ServiceHook

  plurals:
    repository: 'repositories',
    branch: 'branches'

  updateRecord: (store, type, record) ->
    id = get(record, record.get('primaryKey') || 'id')
    root = @rootForType(type)
    plural = @pluralize(root)
    url =  @buildURL(type.url || plural, id)
    data = root: record.toJSON()

    @ajax url, 'PUT',
      data: data
      success: (json) ->
        @sideload(store, type, json, root)
        store.didUpdateRecord(record, json && json[root])

  find: (store, type, id) ->
    root = @rootForType(type)
    plural = @pluralize(root)
    url =  @buildURL(type.url || plural, id)

    @ajax url, 'GET',
      success: (json) ->
        @sideload(store, type, json, root)
        store.load(type, json[root])

  findMany: (store, type, ids) ->
    root = @rootForType(type)
    plural = @pluralize(root)
    url =  @buildURL(type.url || plural)

    @ajax url, 'GET',
      data:
        ids: ids
      success: (json) ->
        @sideload(store, type, json, plural)
        store.loadMany(type, json[plural])

  findAll: (store, type) ->
    root = @rootForType(type)
    plural = @pluralize(root)
    url =  @buildURL(type.url || plural)

    @ajax url, 'GET',
      success: (json) ->
        @sideload(store, type, json, plural)
        store.loadMany(type, json[plural])

  findQuery: (store, type, query, recordArray) ->
    root = @rootForType(type)
    plural = @pluralize(root)
    url =  @buildURL(type.url || plural)

    @ajax url, 'GET',
      data: query,
      success: (json) ->
        @sideload(store, type, json, plural)
        recordArray.load(json[plural])

  rootForType: (type) ->
    # sorry, but @seems like complete bullshit, really
    # return type.url if (type.url)

    parts = type.toString().split('.')
    name = parts[parts.length - 1]
    name.replace(/([A-Z])/g, '_$1').toLowerCase().slice(1)

  buildURL: (record, suffix) ->
    Ember.assert('Namespace URL (' + @namespace + ') must not start with slash', !@namespace || @namespace.toString().charAt(0) != '/')
    Ember.assert('Record URL (' + record + ') must not start with slash', !record || record.toString().charAt(0) != '/')
    Ember.assert('URL suffix (' + suffix + ') must not start with slash', !suffix || suffix.toString().charAt(0) != '/')

    url = ['']
    url.push(@namespace) if (@namespace != undefined)
    url.push(record)
    url.push(suffix) if (suffix != undefined)
    url.join('/')

