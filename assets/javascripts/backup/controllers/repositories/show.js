Travis.Controllers.Repositories.Show = Ember.Object.extend({
  _updateGithubStats: function() {
    if(window.__TESTING__) return;
    var repository = this.get('repository');
    if(repository && repository.get('slug')) $.getJSON('http://github.com/api/v2/json/repos/show/' + repository.get('slug') + '?callback=?', function(data) {
      var element = $('.github-stats');
      element.find('.watchers').attr('href', repository.get('urlGithubWatchers')).text(data.repository.watchers);
      element.find('.forks').attr('href',repository.get('urlGithubNetwork')).text(data.repository.forks);
      element.find('.github-admin').attr('href', repository.get('urlGithubAdmin'));
    });
  }.observes('repository.slug'),

  _updateGithubBranches: function() {
    if(window.__TESTING__) return;
    var selector = $(this.branchSelector);
    var repository = this.get('repository');

    selector.empty();
    $('.tools input').val('');

    // Seeing 404 when hitting travis-ci.org/ as repository exists (BUSY_LOADING?) and slug is null
    // So let's ensure that the slug is populated before making this request.
    if (selector.length > 0 && repository && repository.get('slug')) {
      $.getJSON('http://github.com/api/v2/json/repos/show/' + repository.get('slug') + '/branches?callback=?', function(data) {
        var branches = $.map(data['branches'], function(commit, name) { return name; }).sort();

        // TODO: FIXME
        // Clear selector again as observing 'repository.slug' causes this method (as well as _updateGithubStats) being
        // called twice while switching repository. That results in two identical API calls that lead to selector being
        // updated twice too.
        selector.empty();
        $.each(branches, function(index, branch) { $('<option>', { value: branch }).html(branch).appendTo(selector); });
        selector.val('master');

        this._updateStatusImageCodes();
      }.bind(this));
    }
  }.observes('repository.slug'),

  _updateStatusImageCodes: function() {
    var imageUrl = this.get('_statusImageUrl');
    var repositoryUrl = this.get('_repositoryUrl');

    if (repositoryUrl && imageUrl) {
      $('.tools input.url').val(imageUrl);
      $('.tools input.markdown').val('[![Build Status](' + imageUrl + ')](' + repositoryUrl + ')');
      $('.tools input.textile').val('!' + imageUrl + '(Build Status)!:' + repositoryUrl);
      $('.tools input.rdoc').val('{<img src="' + imageUrl + '" alt="Build Status" />}[' + repositoryUrl + ']');
    } else {
      $('.tools input').val('');
    }
  },

  _statusImageUrl: function() {
    var branch = $(this.branchSelector).val();
    var slug = this.getPath('repository.slug');

    if (branch && slug) {
      return 'https://secure.travis-ci.org/' + slug + '.png?branch=' + branch;
    }
  }.property('repository.slug'),

  _repositoryUrl: function() {
    var slug = this.getPath('repository.slug');
    if (slug) return 'http://travis-ci.org/' + slug;
  }.property('repository.slug'),
});
