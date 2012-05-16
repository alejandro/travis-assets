@Travis.ServiceHook = Travis.Model.extend
  primaryKey: 'uid'
  name:       DS.attr('string')
  owner_name: DS.attr('string')
  active:     DS.attr('boolean')

  toggle: ->
    @writeAttribute('active', !@get('active'))
    @commitRecord(owner_name: @get('owner_name'), name: @get('name'))

  urlGithubAdmin: (->
    return @get('url') + '/admin/hooks#travis_minibucket'
  ).property('slug').cacheable(),

@Travis.ServiceHook.reopenClass
  url: 'profile/service_hooks'

