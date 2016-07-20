var koa = require('koa');
var logger = require('koa-logger');
var route = require('koa-route');
var json = require('koa-json');

var state = {
  led: false,
  temparature: null
};

var app = koa();

app.use(logger());
app.use(json());

var five = require("johnny-five");
var board = new five.Board({ repl: false });

board.on("ready", function() {
  var temperature = new five.Thermometer({
    controller: "TMP36",
    pin: "A0"
  });

  var led = new five.Led(13);

  temperature.on("change", function() {
    state.temparature = this.celsius;
    //console.log(this.celsius + "°C", this.fahrenheit + "°F");
  });

  app.use(route.get('/temperature', temperatureStatus));
  app.use(route.get('/led', ledStatus))

  app.use(route.post('/led/toggle', ledToggle))

  function *temperatureStatus() {
    this.body = { 
      temperature: state.temparature 
    };
  }

  function *ledStatus() {
    this.body = {
      led: state.led
    };
  }

  function *ledToggle() {
    if (state.led) {
      state.led = false;
      led.off();
    } else {
      state.led = true;
      led.on();
    }

    this.body = {
      led: state.led
    };
  }

  app.listen(3000);
  console.log('Listening on port 3000...');
});
