Travis.Controllers.Repositories.Show = Ember.Object.extend({

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
