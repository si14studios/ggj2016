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

// Variables
var hasDisplay = false;
var users = [];

// Fired when someone connects
io.on('connection', function(socket) {

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

    socket.on('register user', function(username, character) {
        socket.broadcast.emit('add user', username, character);
        users[username] = {name: username, sock: socket, character: character}
    });

    // sets hasDisplay to true if the display is assigned
    socket.on('check in', function(info) {
        if (info == 'display') {
            hasDisplay = true;
        }
    });

    socket.on('stream input', function(input, user) {
        console.log(user + ': ' + input);
        socket.broadcast.emit('display input', input, user);
    });

    socket.on('begin match', function() {
        socket.broadcast.emit('deal target', 'peter', 'mike');
        console.log('dealing targets');
    });

    // Fires when someone disconnects
    socket.on('disconnect', function() {
        hasDisplay = false;
        io.sockets.emit('request check in');
    });
});

// Starts server
http.listen(80, function(){
    console.log('listening on *:80');
});
