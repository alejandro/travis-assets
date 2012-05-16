@Travis.LeftController = Ember.ArrayController.extend
  init: ->
    @_super()
    @tabs = Travis.LeftStates.create()
    @set 'searchBox', Travis.app.layout.left.searchBox
    @ticker = Travis.Ticker.create(context: this, targets: ['content'])

  activate: (tab, params) ->
    @set('content', @sorted(@[tab]()))
    @tabs.activate(tab)

  recent: ->
    Travis.Repository.recent()

  mine: ->
    Travis.Repository.ownedBy(name)

  search: ->
    Travis.Repository.search(@query())

  query: ->
    @getPath('searchBox.value')

  searchObserver: (->
    @activate(if @query() then 'search' else 'recent')
  ).observes('searchBox.value')

  sorted: (content) ->
    # TODO how to sort a RecordArray?
    # content.addObserver 'length', ->
    #   sorted = content.sort (a, b) ->
    #     b.get('last_build_started_at') - a.get('last_build_started_at')
    content
