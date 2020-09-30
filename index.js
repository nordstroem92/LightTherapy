var PORT = process.env.PORT || 5000;
var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

server.listen(PORT, function() {
  console.log('Server is running');
});

app.get('/',function(req, res){//get,put,post,delete   
  res.sendFile(__dirname + '/public/index.html');
});

const { ArduinoIoTCloud } = require('arduino-iot-js');
const ArduinoIoTApi = require('@arduino/arduino-iot-client');

const thingId = "01fab366-dfdb-46b4-9ba7-b9ac13cd44ff"
const variableName = "lightstatus"

const options = {
    clientId: "gmED5ANJG4GS2mOsFj7SXkX4d2cEAuPF",
    clientSecret: "5rTnu9H0iOMrXAoAlWobaCr3O2BnWXxa7Tqwpgr3y5iR9lZRyu9yYezcTPWuCkIi",
    onDisconnect:  message  => {
        console.error(message);
    }
}

// Connect to Arduino IoT Cloud MQTT Broker
ArduinoIoTCloud.connect(options)
  .then(() => {
    console.log("Connected to Arduino IoT Cloud MQTT broker");

    // Init Arduino API Client
    const ArduinoIoTClient = ArduinoIoTApi.ApiClient.instance;
    ArduinoIoTClient.authentications['oauth2'].accessToken = ArduinoIoTCloud.getToken();

    const thingsApi = new ArduinoIoTApi.ThingsV2Api(ArduinoIoTClient);

    return thingsApi.thingsV2List()
      .then(things => {

        var value = true;
        ArduinoIoTCloud.sendProperty(thingId, variableName, value).then(() => {
            console.log("Property value correctly sent");
        });  
      });
  })
  .catch(error => console.error(error));