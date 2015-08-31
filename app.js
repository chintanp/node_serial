
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    socket = require('./routes/socket.js'),
    util = require('util'),
    http = require('http'),
    fs = require('fs'),
    net = require('net'),             // For TCP communication with datalogger
    url = require('url'),
    events = require('events'),
    path = require('path'),           //For manipulating file-paths
    request = require('request');

var config = require('./config.json')
    , username = config['user']
    , apiKey = config['apiKey']
    , token = config['token']
    , Plotly = require('../.')(username, apiKey)
    , Signal = require('random-signal');

var data = {
    'x':[]   // empty arrays since we will be streaming our data to into these arrays
    , 'y':[]
    , 'type':'scatter'
    , 'mode':'lines+markers'
    , marker: {
        color: "rgba(31, 119, 180, 0.96)"
    }
    , line: {
        color:"rgba(31, 119, 180, 0.31)"
    }
    , stream: {
        "token": token
        , "maxpoints": 100
    }
}

// build your layout and file options
var graphOptions = {
    "filename": "streamSimpleSensor"
    , "fileopt": "overwrite"
    , "layout": {
        "title": "streaming mock sensor data"
    }
    , "world_readable": true
};





var app = module.exports = express();
var server = require('http').createServer(app);

// Hook Socket.io into Express
var io = require('socket.io').listen(server);

// Configuration
app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

//io.sockets.on('connection', socket);


//------------------New Code -----------------//

var com = require("serialport");
var serialPort = new com.SerialPort("COM4", {
    baudrate: 9600,
    parser: com.parsers.readline('\r')
});


// Emit welcome message on connection
io.on('connection', function(http_socket) {

    console.log("Socket connected");
    serialPort.on('open',function() {
        console.log('Port open');

    });

    serialPort.on('data', function(data) {

        console.log(data);

        Plotly.plot(data, graphOptions, function (err, resp) {
            if (err) return console.log("ERROR", err)

            console.log(resp)

            var plotlystream = Plotly.stream(token, function () {})
            var signalstream = Signal({tdelta: 100}) //


            plotlystream.on("error", function (err) {
                signalstream.destroy()
            })

            // Okay - stream to our plot!
            signalstream.pipe(plotlystream)
        })

        http_socket.emit('old_data', { livedata : data } );
    });



    //http_socket.on('i am client', console.log);
});

// Start server
server.listen(8000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
