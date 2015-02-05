(function() {
  var debug = 1 ? console.log.bind(console, '[app]') : () => {};

  var els = {
    dialog: document.querySelector('#dialog'),
    inputs: {
      discover: document.querySelector('#input-discover'),
      register: document.querySelector('#input-register')
    },
    buttons: {
      discover: document.querySelector('#button-discover'),
      register: document.querySelector('#button-register'),
      get: document.querySelector('#button-get')
    }
  };

  var services = {};
  var advertisedService;

  els.buttons.register.addEventListener('click', () => {
    debug('button click');
    navigator.service.unregister(advertisedService);
    advertisedService = els.inputs.register.value;
    navigator.service.register(advertisedService);
  });

  els.buttons.discover.addEventListener('click', () => {
    debug('button click');
    var serviceId = els.inputs.discover.value;
    navigator.service.discover(serviceId, onServiceFound);
    els.dialog.open();
  });

  els.dialog.addEventListener('closed', () => {
    navigator.service.discover.stop();
    var buttons = els.dialog.querySelectorAll('button');
    [].forEach.call(buttons, el => el.remove());
    services = {};
  });

  function onServiceFound(service) {
    debug('service found', service);
    if (services[service.address]) return;
    services[service.address] = service;
    var item = document.createElement('button');
    item.textContent = service.device;
    item.addEventListener('click', onButtonClick);
    item.dataset.address = service.address;
    els.dialog.appendChild(item);
  }

  function onButtonClick(e) {
    var button = e.currentTarget;
    var service = services[button.dataset.address];


    var request = new XMLHttpRequest({ mozSystem: true });

    request.onload = () => {
      debug('xhr complete');
    };

    request.onerror = (e) => {
      debug('xhr error', e);
    };

    request.open('get', 'http://' + service.address + ':3000/data', true);
    request.send();

    els.dialog.close();
  }

  els.buttons.get.addEventListener('click', () => {
    debug('button click');
    var serviceId = els.inputs.discover.value;
    navigator.service.discover(serviceId, onServiceFound);
    els.dialog.open();
  });

  // navigator.service.register.get('/data', (req, res) => {

  // });

  window.server = new HttpServer();
  server.get('/data', function (req, res, done){
    debug('request', req);
    res.write('pong');
    done();
  });

  server.start(3000);
})();