@Travis.ServiceHook = Travis.Model.extend
  primaryKey: 'uid'

  toggle: ->
    @writeAttribute('active', !@get('active'))
    @commitRecord(owner_name: @get('owner_name'), name: @get('name'))

  urlGithubAdmin: (->
    return @get('url') + '/admin/hooks#travis_minibucket'
  ).property('slug').cacheable(),

@Travis.ServiceHook.reopenClass
  resource: 'profile/service_hooks'

