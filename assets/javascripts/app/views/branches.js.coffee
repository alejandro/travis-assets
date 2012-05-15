@Travis.Views = {} if @Travis.Views == undefined

@Travis.Views.Branches =
  List: Ember.View.extend
    templateName: 'app/templates/branches/list'
    repositoryBinding: 'Travis.app.main.repository'
    branchesBinding: 'Travis.app.main.branches'

  Item: Ember.View.extend
    color: (->
      Travis.Helpers.colorForResult(this.getPath('content.result'))
    ).property('content.result')


