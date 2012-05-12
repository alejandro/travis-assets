@Travis = Ember.Namespace.create() if @Travis == undefined

@Travis.AppController = Ember.Application.extend
  UPDATE_TIMES_INTERVAL: 5000

  channels: ['common']
  active_channels: []
  channel_prefix: ''

  init: ->
    @_super()
    @initStore()

  run: ->
    @action()
    # @initPusher()
    # @initEvents()

  home: ->
    @layout = Travis.Views.Layouts.Default.create()
    @layout.appendTo('body')

    @set 'main', Travis.RepositoryController.create()
    # @events = Travis.Controllers.Events.create()
    # @left   = Travis.Controllers.Repositories.List.create()
    # @right  = Travis.Controllers.Sidebar.create()

  action: ->
    action = $('body').attr('id')
    @[action]() if(@[action])

  initStore: ->
    @store = DS.Store.create
      revision: 4
      adapter: DS.RESTAdapter.create
        plurals:
          repositories: 'repositories',
          builds: 'builds',
          branches: 'branches'

    @store.adapter.set 'mappings',
        builds: Travis.Build,
        commits: Travis.Commit,
        jobs: Travis.Job

  profile: ->
    Travis.ServiceHooksController.create()

  receive: (event, data) ->
    Travis.events.receive(event, data)

  subscribe: (channel) ->
    if @active_channels.indexOf(channel) == -1
      @active_channels.push(channel)
      pusher.subscribe(@channel_prefix + channel).bind_all(@receive) if window.pusher

  unsubscribe: (channel) ->
    ix = @active_channels.indexOf(channel)
    if ix == -1
      @active_channels.splice(ix, 1)
      pusher.unsubscribe(@channel_prefix + channel) if window.pusher

  initPusher: ->
    $.each(Travis.channels, (ix, channel) => @subscribe(channel)) if window.pusher

  # initEvents: ->
  #   //this is only going to work for rendered elements

  #   $('.tool-tip').tipsy({ gravity: 'n', fade: true })
  #   $('.fold').live('click', -> $(this).toggleClass('open') })

  #   $('#top .profile').mouseover(-> $('#top .profile ul').show() })
  #   $('#top .profile').mouseout(-> $('#top .profile ul').hide() })

  #   $('#workers .group').live('click', -> $(this).toggleClass('open') })

  #   $('li#tab_recent').click(->
  #     Travis.left.recent()
  #   })
  #   $('li#tab_my_repositories').click(->
  #     Travis.left.owned_by($(this).data('github-id'))
  #   })
  #   $('li#tab_search').click(->
  #     Travis.left.search()
  #   })

  #   $('.repository').live('mouseover', ->
  #     $(this).find('.description').show()
  #   })

  #   $('.repository').live('mouseout', ->
  #     $(this).find('.description').hide()
  #   })

  #   $('.tools').live('click', ->
  #     $(this).find('.content').toggle()
  #   }).find('.content').live('click', function(event){
  #     event.stopPropagation()
  #   }).find('input[type=text]').live('focus', ->
  #     @select()
  #   }).live('mouseup', function(e) {
  #     e.preventDefault()
  #   })

  #   $('html').click(function(e) {
  #     if ($(e.target).closest('.tools .content').length == 0 && $('.tools .content').css('display') != 'none') {
  #       $('.tools .content').fadeOut('fast')
  #     }
  #   })
  # },

  # startLoading: ->
  #   $("#main").addClass("loading")

  # stopLoading: ->
  #   $("#main").removeClass("loading")


