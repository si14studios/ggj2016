// Borind requirement setup
var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Set up server
app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.use(express.static(__dirname + '/public'));
var hasDisplay = false;

// Variables
var hasDisplay = false;

// Fired when someone connects
io.on('connection', function(socket){

    // Handles dealing out roles
    socket.on('send role', function(role) {
        if(role == 'unassigned') {
            if(!hasDisplay) {
                hasDisplay = true;
                socket.emit('assign role', 'display');
            } else {
                socket.emit('assign role', 'controller');
            }
        }
    });
    socket.emit('request role');

    // Fires when someone disconnects
    socket.on('disconnect', function() {
        hasDisplay = false;
        socket.broadcast.emit('request check in');
    });

    // sets hasDisplay to true if the display is assigned
    socket.on('check in', function(info) {
        if (info == 'display') {
            hasDisplay = true;
        }
    });
});

// Starts server
http.listen(80, function(){
    console.log('listening on *:80');
});
