var serialport = require('serialport'),
    plotly = require('plotly')('chintanp','vu32637k4y'),
    tokens = ['xg5vkjdoct', 'qsc0j3pqks'];

var portName = 'COM5';
var sp = new serialport.SerialPort(portName,{
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline("\n")
});

// helper function to get a nicely formatted date string
function getDateString() {
    var time = new Date().getTime();
    // 32400000 is (GMT+9 Japan)
    // for your timezone just multiply +/-GMT by 36000000
    var datestr = new Date(time + 19800000).toISOString().replace(/T/, ' ').replace(/Z/, '');
    return datestr;
}

var initdata = [    
                    {name: "Temperature", x:[], y:[], stream:{token:tokens[0], maxpoints: 1500}}, 
                    {name: "Humidity", x:[], y:[], stream:{token:tokens[1], maxpoints: 1500}}
                ];

var initlayout = {fileopt : "new", filename : "Live Streaming Temperature and Humidity"};

plotly.plot(initdata, initlayout, function (err, msg) {
    if (err)
        return console.log(err)

    console.log(msg);

    var streams = { 
        "temperature" : plotly.stream(tokens[0], function (err, res) {
            if (err) console.log(err);
            console.log(err, res);
        }), 
        "humidity" : plotly.stream(tokens[1], function (err, res) {
            if (err) console.log(err);
            console.log(err, res);
        }) 
    };

/// TODO:  change the streamObject to read sensor data into two streams

    sp.on('data', function(input) {
        if(isNaN(input) || input > 1023) return;

        var values = input.split('\t');

        // writing the temperature stream
        var tempStreamObject = JSON.stringify({ x : getDateString(), y : values[0] });
        
        console.log("temperatureObject: " + tempStreamObject);

        streams["temperature"].write(tempStreamObject + '\n');

        // writing the humidiity stream
        var humStreamObject = JSON.stringify({ x : getDateString(), y : values[1] });
        
        console.log("humidityObject: " + humStreamObject);

        streams["humidity"].write(humStreamObject + '\n');
    });
});
