shell = require 'shell'

# Open clicked links with target="blank" in the default browser
$(document).on 'click', 'a', (e) ->
  if this.target == '_blank'
    e.preventDefault()
    shell.openExternal(this.href)

# Override window.open to open links with target="blank" in the default browser
open = window.open
window.open = (url, target, features) ->
  if target == '_blank'
    shell.openExternal(url)
  else
    open.apply(window, arguments)
