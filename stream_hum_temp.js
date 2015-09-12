///var serialport = require('serialport'),
var    plotly = require('plotly')('chintanp','vu32637k4y'),
    tokens = ['xg5vkjdoct', 'qsc0j3pqks'], 
     Signal = require('random-signal');

//var portName = 'COM5';
/*var sp = new serialport.SerialPort(portName,{
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline("\n")
});

*/// helper function to get a nicely formatted date string
function getDateString() {
    var time = new Date().getTime();
    // 32400000 is (GMT+9 Japan)
    // for your timezone just multiply +/-GMT by 36000000
    var datestr = new Date(time + 19800000).toISOString().replace(/T/, ' ').replace(/Z/, '');
    return datestr;
}

var initdata = [    
                    {name: "Temperature", x:[], y:[], stream:{token:tokens[0], maxpoints: 100}}, 
                    {name: "Humidity", x:[], y:[], stream:{token:tokens[1], maxpoints: 100}}
                ];
var data1 = {x:[], y:[], stream: {token: tokens[0], maxpoints: 50}}, 
    data2 = {x:[], y:[], stream: {token: tokens[1], maxpoints: 1500}};


var initlayout = {fileopt : "new", filename : "Live Streaming Temperature and Humidity"};
var layout1 = {fileopt : "new", filename : "Live Streaming Temperature"};
var layout2 = {fileopt : "new", filename : "Live Streaming Humidity"};

var opt = {
  sep: "\n"     // seperator 
, tdelta: 200   // milliseconds 
}

/*plotly.plot(initdata, initlayout, function (err, msg) {
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

        var tempStreamObject = Signal(opt);//JSON.stringify({ x : getDateString(), y : Signal().y });
        
        console.log("temperatureObject: " + tempStreamObject);

        streams["temperature"].write(tempStreamObject + '\n');

        // writing the humidiity stream
        var humStreamObject = Signal(opt); //JSON.stringify({ x : getDateString(), y : Signal().y });
        
        console.log("humidityObject: " + humStreamObject);

        streams["humidity"].write(humStreamObject + '\n');  


  /*  sp.on('data', function(input) {
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
});*/

plotly.plot(data1, layout1, function (err, msg) {
    if (err)
        return console.log(err)

    console.log(msg);

    var plotlystream1 = plotly.stream(tokens[0], function() {}),
            signalstream1 = Signal({tdelta: 100});

        plotlystream1.on("error", function (err) { signalstream1.destroy(); });

        //plotlystream.write(signalstream);
        signalstream1.pipe(plotlystream1);


});


/*plotly.plot(data2, layout2, function (err, msg) {
    if (err)
        return console.log(err)

    console.log(msg);

    var plotlystream2 = plotly.stream(tokens[1], function() {}),
            signalstream2 = Signal({tdelta: 100});

        plotlystream2.on("error", function (err) { signalstream2.destroy(); });

        //plotlystream.write(signalstream);
        signalstream2.pipe(plotlystream2);

});*/