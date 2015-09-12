var http = require('http');
var serialport = require('serialport');

var portName = 'COM5';
var sp = new serialport.SerialPort(portName,{
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline("\n")
});

sp.on('data', function(input) {
//var data = 540.0;

console.log(input);

var sensorData = input.split("\t");
var temp = sensorData[0];
var hum = sensorData[1];

console.log("temperature: " + temp);
console.log("humidity: " + hum);

var items = [];

        items.push({"id": "humidity", "current_value": hum});
        items.push({"id": "temperature", "current_value": temp});
        var jsonData = { "version": "1.0.0", "datastreams": items };
        var bodyLength = JSON.stringify(jsonData).length;

        var options = {
            hostname: 'api.xively.com',
            port: 80,
            path: 'https://api.xively.com/v2/feeds/1191004940',
            method: 'PUT',
            headers: {"Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": bodyLength,
                "X-ApiKey": 'm9Q9bqA8I85pZWDuSSSSklGIpsRhsS3TaDKwqr0728xvOfAF',
                "Host": "api.xively.com"
            }
        };

        var req = http.request(options, function (res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data',function (data) {
                console.log(data);
            }).on('end', function () {
                    console.log("end");
                });
        });


        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });


        req.write(JSON.stringify(jsonData));
        req.end();
    });
