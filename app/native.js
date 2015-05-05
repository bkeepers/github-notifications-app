// Start of loading native modules from within the renderer. See
// renderer/index.coffee for the real meat.

try {
  // Give me coffeescript or give me death
  require('coffee-script');
  require('coffee-cache').setCacheDir('/tmp/github-notifications-coffee-cache')
  Object.defineProperty(require.extensions, '.coffee', {
    writable: false,
    value: require.extensions['.coffee']
  })

  require('./renderer')
} catch(error) {
  console.error(error);
}
