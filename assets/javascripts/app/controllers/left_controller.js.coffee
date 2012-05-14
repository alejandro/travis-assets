@Travis.LeftController = Ember.ArrayController.extend
  init: ->
    @_super()
    @tabs = Travis.LeftStates.create()
    @set 'searchBox', Travis.app.layout.left.searchBox

  activate: (tab, params) ->
    @set('content', @[tab]())
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
