"use strict";

var socketIO = require('socket.io');

/**
 * socketServer.js
 * 
 * Socket.io
 *     http://socket.io/
 */

exports.start = function (httpServer) {
    
    // start listening for socket connection requests to the server ('webServer.js')
    var io = socketIO(httpServer);
    io.serveClient(true);
    
    // escape codes
    var magenta  = '\u001b[35m';
    var green    = '\u001b[32m';
    var red      = '\u001b[31m';
    var reset    = '\u001b[0m';
    
    console.log(green +"Socket Server ready!");
    console.log(reset);
    
    return io;
}

