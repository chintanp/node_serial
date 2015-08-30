////////////////////////////////////////////////////////
// Use the cool library                               //
// git://github.com/voodootikigod/node-serialport.git //
// to read the serial port where arduino is sitting.  //
////////////////////////////////////////////////////////               
var com = require("serialport");


var serialPort = new com.SerialPort("COM4", {
    baudrate: 115200,
    parser: com.parsers.readline('\r')
  });

serialPort.on('open',function() {
  console.log('Port open');

  serialPort.on('data', function(data) {
  console.log(data);
});

});

