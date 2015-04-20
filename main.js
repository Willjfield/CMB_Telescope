"use strict";


// Web server (to configure the web server open "webServer.js")
var ip   = undefined;
var port = 8080;
var server = require('./webServer').start(ip, port);

// Web sockets (to configure the webSocket server open "socketServer.js")
var io = require('./socketServer').start(server);

// Firmata
var serialPort = '/dev/tty.usbmodemfd121';
var board = require('./firmataConnector').start(serialPort);

var tmpVal;

var userCounter = 0;

// Arduino is connected
board.on('connection', function () {
    
    function updateLED () {
        board.analogRead(board.A0, function(val) {   
        tmpVal=val;
        console.log(val);
        io.sockets.emit('msg',tmpVal);
    });
    
        /*// Set the pin to Pulse With Modulation
        board.pinMode(11, board.PWM);
        
        // Turn Arduino LED on
        var intensity = userCounter * 10;
        if (intensity > 254) intensity = 254;
        
        board.analogWrite(11, intensity);*/
    };
    

    // WebSocket connections
    io.sockets.on('connection', function (socket) {

        socket.emit('msg',tmpVal);
        
        console.log('client connected: '+ socket.id);
        userCounter++;
        updateLED();
        
        socket.on('disconnect', function () {
            
            console.log('client disconnected: '+ socket.id);
            userCounter--;
            updateLED();
        });
    });
});