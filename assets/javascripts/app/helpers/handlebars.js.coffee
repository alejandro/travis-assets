safe = (string) ->
  new Handlebars.SafeString(string)

Handlebars.registerHelper 'whats_this', (id) ->
  safe '<span title="What\'s This?" class="whats_this" onclick="$.facebox({ div: \'#' + id + '\'})">&nbsp;</span>'

Handlebars.registerHelper 'tipsy', (text, tip) ->
  safe '<span class="tool-tip" original-title="' + tip + '">' + text + '</span>'

Handlebars.registerHelper 't', (key) ->
  safe I18n.t(key)

# TODO how to get this to work so it updates the bindings?
Handlebars.registerHelper 'timeAgoInWords', (path, object) ->
  safe Travis.Helpers.timeAgoInWords(Ember.getPath(this, path)) || '-'
