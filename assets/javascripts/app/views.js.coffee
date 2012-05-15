@Travis.Views =
  Layouts:
    Default: Ember.View.extend
      templateName: 'app/templates/layouts/default'

    Main: Ember.View.extend
      templateName: 'app/templates/layouts/_main'

    Left: Ember.View.extend
      templateName: 'app/templates/layouts/_left'
      click: (event)->
        # TODO this is being triggered twice?
        # TODO this is being triggered when the searchbox is clicked? wtf.
        id = $(event.srcElement).closest('.tabs li').attr('id')
        Travis.app.left.activate(id.replace('tab_', '')) if id

    Right: Ember.View.extend
      templateName: 'app/templates/layouts/_right'

  Repositories:
    Show: Ember.View.extend
      templateName: 'app/templates/repositories/show'
      repositoryBinding: 'Travis.app.main.repository'
      buildBinding: 'Travis.app.main.build'
      jobBinding: 'Travis.app.main.job'

    List: Ember.View.extend
      templateName: 'app/templates/repositories/list'
      repositoriesBinding: 'Travis.app.left'

    Item: Ember.View.extend
      color: (->
        Travis.Helpers.colorForResult(this.getPath('content.last_build_result'))
      ).property('content.last_build_result')
      class: (->
        classes = ['repository', @get('color')]
        classes.push 'selected' if @getPath('content.selected')
        classes.join(' ')
      ).property('content.result', 'content.selected')

    Tab: Ember.CollectionView

  Builds:
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
        id = this.getPath('repository.id')
        number = this.getPath('builds.lastObject.number')
        Travis.Build.olderThanNumber(id, number)
      hasMore: Em.Binding.oneWay('content.lastObject.number').transform (value) ->
        console.log value
        value && value > 1

    Item: Ember.View.extend
      color: (->
        Travis.Helpers.colorForResult(this.getPath('content.result'))
      ).property('content.result')

  Branches:
    List: Ember.View.extend
      templateName: 'app/templates/branches/list'
      repositoryBinding: 'Travis.app.main.repository'
      branchesBinding: 'Travis.app.main.branches'

    Item: Ember.View.extend
      color: (->
        Travis.Helpers.colorForResult(this.getPath('content.result'))
      ).property('content.result')

  Jobs:
    Show: Ember.View.extend
      templateName: 'app/templates/jobs/show'
      jobBinding: 'Travis.app.main.job'
      commitBinding: 'Travis.app.main.job.commit'
      color: (->
        Travis.Helpers.colorForResult(this.getPath('job.result'))
      ).property('job.result')

    Log: Ember.View.extend
      templateName: 'app/templates/jobs/log'
      jobBinding: 'Travis.app.main.job'

    List: Ember.View.extend
      templateName: 'app/templates/jobs/list'
      buildBinding: 'Travis.app.main.build'
      configKeys: (->
        config = @getPath('build.config')
        return [] unless config
        keys = $.keys($.only(config, 'rvm', 'gemfile', 'env', 'otp_release', 'php', 'node_js', 'perl', 'python', 'scala'))
        headers = [I18n.t('build.job'), I18n.t('build.duration'), I18n.t('build.finished_at')]
        $.map(headers.concat(keys), (key) -> return $.camelize(key))
      ).property('build.config')

    Item: Ember.View.extend
      tagName: 'tbody'
      color: (->
        Travis.Helpers.colorForResult(this.getPath('content.result'))
      ).property('content.result')
      configValues: (->
        config = @getPath('content.config')
        return [] unless config
        values = $.values($.only(config, 'rvm', 'gemfile', 'env', 'otp_release', 'php', 'node_js', 'scala', 'jdk', 'python', 'perl'))
        $.map(values, (value) -> Ember.Object.create(value: value))
      ).property('content.config')

  Workers:
    List: Ember.View.extend
      templateName: 'app/templates/workers/list'

  Queues:
    Show: Ember.View.extend
      templateName: 'app/templates/queues/show'


