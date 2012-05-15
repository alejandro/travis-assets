@Travis.Views = {} if @Travis.Views == undefined

@Travis.Views.Builds =
  Show: Ember.View.extend
    templateName: 'app/templates/builds/show'
    repositoryBinding: 'Travis.app.main.repository'
    buildBinding: 'Travis.app.main.build'
    commitBinding: 'Travis.app.main.build.commit'
    color: (->
      Travis.Helpers.colorForResult(this.getPath('build.result'))
    ).property('build.result')

  List: Ember.View.extend
    templateName: 'app/templates/builds/list'
    repositoryBinding: 'Travis.app.main.repository'
    buildsBinding: 'Travis.app.main.builds'
    showMore: ->
      Travis.app.main.showMore()
    hasMoreBinding: Em.Binding.oneWay('content.lastObject.number').transform (value) ->
      value && value > 1

  Item: Ember.View.extend
    color: (->
      Travis.Helpers.colorForResult(this.getPath('content.result'))
    ).property('content.result')


