var app = require('app');
var dialog = require('dialog');
var ipc = require('ipc');
var Menu = require('menu');
var MenuItem = require('menu-item');
var BrowserWindow = require('browser-window');

var mainWindow = null;
var menu = null;

for (var i = 0; i < process.argv.length; i++) {
  if ('--local' == process.argv[i]) {
    process.env['APP_URL'] = 'http://localhost:8000/'
  }
}

if(!process.env['APP_URL']) {
  process.env['APP_URL'] = 'https://notifications.githubapp.com/'
}

// Hack to allow the remote app to load scripts from this directory
process.env['NODE_PATH'] = __dirname

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.terminate();
});

// Handles urls given to Electron, useful for maintaining a single
// application but launching multiple windows when invoked again.
app.on('open-url', function(event, url) {
  dialog.showMessageBox({message: url, buttons: ['OK']});
});

// Notifies the render process when atom-shell has finished loading.
app.on('ready', function() {
  app.commandLine.appendSwitch('js-flags', '--harmony_collections');

  options = { width: 1024, height: 768 }
  mainWindow = new BrowserWindow(options);
  mainWindow.loadUrl(process.env.APP_URL);

  mainWindow.on('page-title-updated', function(event, title) {
    event.preventDefault();

    this.setTitle(title);
  });

  mainWindow.on('closed', function() {
    console.log('closed');
    mainWindow = null;
  });

  mainWindow.on('unresponsive', function() {
    console.log('unresponsive');
  });

  var appName = 'GitHub Notifications';

  var template = [
    {
      label: appName,
      submenu: [
        {
          label: 'About ' + appName,
          selector: 'orderFrontStandardAboutPanel:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide ' + appName,
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        {
          label: 'Show All',
          selector: 'unhideAllApplications:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() { app.quit(); }
        },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Command+Z',
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'Command+X',
          selector: 'cut:'
        },
        {
          label: 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:'
        },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        },
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: function() { BrowserWindow.getFocusedWindow().restart(); }
        },
        {
          label: 'Enter Fullscreen',
          click: function() { BrowserWindow.getFocusedWindow().setFullscreen(true); }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Command+I',
          click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
        },
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        {
          label: 'Close',
          accelerator: 'Command+W',
          selector: 'performClose:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Bring All to Front',
          selector: 'arrangeInFront:'
        },
      ]
    },
  ];

  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  ipc.on('message', function(processId, routingId, type) {
    if (type == 'menu')
      menu.popup(mainWindow);
  });
});
