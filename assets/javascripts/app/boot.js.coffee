# __DEBUG__ = true
# Ember.LOG_BINDINGS = true

@Travis.app = Travis.AppController.create()

$ ->
  Travis.app.run() if window.env != undefined && window.env != 'jasmine'

$.ajaxSetup
  beforeSend: (xhr) ->
    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))

# Pusher.log = (message) -> window.console.log(arguments) if window.console && window.console.log
# $.facebox.settings.closeImage = '/images/facebox/closelabel.png'
# $.facebox.settings.loadingImage = '/images/facebox/loading.gif'

