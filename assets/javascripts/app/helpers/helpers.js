window.Travis.Helpers = {
  colorForResult: function(result) {
    return result == 0 ? 'green' : result == 1 ? 'red' : null;
  },

  timeAgoInWords: function(date) {
    return $.timeago.distanceInWords(date);
  },

  durationFrom: function(started, finished) {
    started  = started  && this._toUtc(new Date(this._normalizeDateString(started)));
    finished = finished ? this._toUtc(new Date(this._normalizeDateString(finished))) : this._nowUtc();
    return started && finished ? Math.round((finished - started) / 1000) : 0;
  },

  timeInWords: function(duration) {
    var days    = Math.floor(duration / 86400);
    var hours   = Math.floor(duration % 86400 / 3600);
    var minutes = Math.floor(duration % 3600 / 60);
    var seconds = duration % 60;

    if(days > 0) {
      return 'more than 24 hrs';
    } else {
      var result = [];
      if(hours  == 1) { result.push(hours + ' hr'); }
      if(hours   > 1) { result.push(hours + ' hrs'); }
      if(minutes > 0) { result.push(minutes + ' min'); }
      if(seconds > 0) { result.push(seconds + ' sec'); }
      return result.length > 0 ? result.join(' ') : '-';
    }
  },

  _normalizeDateString: function(string) {
    if(window.JHW) {
      // TODO i'm not sure why we need to do this. in the chrome console the
      // Date constructor would take a string like "2011-09-02T15:53:20.927Z"
      // whereas in unit tests this returns an "invalid date". wtf ...
      string = string.replace('T', ' ').replace(/-/g, '/');
      string = string.replace('Z', '').replace(/\..*$/, '');
    }
    return string;
  },

  _nowUtc: function() {
    return this._toUtc(new Date());
  },

  _toUtc: function(date) {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  },

  formatConfig: function(config) {
    var config = $.only(config, 'rvm', 'gemfile', 'env', 'otp_release', 'php', 'node_js', 'scala', 'jdk', 'python', 'perl');
    var values = $.map(config, function(value, key) {
      value = (value && value.join) ? value.join(', ') : (value || '');
      return '%@: %@'.fmt($.camelize(key), value);
    });
    return values.length == 0 ? '-' : values.join(', ');
  },

  formatMessage: function(message, options) {
    message = message || '';
    if(options.short) message = message.split(/\n/)[0];
    return this.emojize(this.escape(message)).replace(/\n/g, '<br/>');
  },

  emojize: function(text) {
    var emojis = text.match(/:\S+?:/g);
    if (emojis !== null){
      $.each(emojis.uniq(), function(ix, emoji) {
        var strippedEmoji = emoji.substring(1, emoji.length - 1);
        if (EmojiDictionary.indexOf(strippedEmoji) != -1) {
          var image = '<img class="emoji" title="' + emoji + '" alt="' + emoji + '" src="' + Travis.assets.host + '/' + Travis.assets.version + '/images/emoji/' + strippedEmoji + '.png"/>';
          text = text.replace(new RegExp(emoji, 'g'), image);
        }
      });
    }
    return text;
  },

  escape: function(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },

  // extracted from build and job models

  _formattedDuration: function() {
    var duration = this.get('duration');
    if(!duration) duration = this.durationFrom(this.get('started_at'), this.get('finished_at'));
    return this.timeInWords(duration);
  },

  _formattedFinishedAt: function() {
    return this.timeAgoInWords(this.get('finished_at')) || '-';
  },

  _formattedConfig: function() {
    var config = $.only(this.get('config'), 'rvm', 'gemfile', 'env', 'otp_release', 'php', 'node_js', 'scala', 'jdk', 'python', 'perl');
    var values = $.map(config, function(value, key) {
      value = (value && value.join) ? value.join(', ') : (value || '');
      return '%@: %@'.fmt($.camelize(key), value);
    });
    return values.length == 0 ? '-' : values.join(', ');
  },

  _formattedMessage: function() {
    return this.emojize(this.escape(this.getPath('commit.message') || '')).replace(/\n/g,'<br/>');
  },

  _formattedCommit: function(record) {
    var branch = this.getPath('commit.branch');
    return (this.getPath('commit.sha') || '').substr(0, 7) + (branch ? ' (%@)'.fmt(branch) : '');
  },

  _formattedCompareUrl: function() {
    var parts = (this.getPath('commit.compare_url') || '').split('/');
    return parts[parts.length - 1];
  },
};
