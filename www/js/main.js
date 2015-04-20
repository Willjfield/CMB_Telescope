"use strict";
/*function main() {

    
    
    // connect to the light bulb server
    var socket = io.connect('http://localhost:8080');
}
window.addEventListener('DOMContentLoaded', main);
*/
	 function init() {
        var socket = io('http://localhost:8080');
        
        // 
        socket.on('connect', function () {
                    console.log('The server is ready!');
        });
        
        // on msg
        socket.on('msg', function (data) {
            
            // log the message
            console.log(data);
            
             // send message
            socket.emit('msg', 'hello server');
        });
    }
    window.addEventListener('DOMContentLoaded', init);