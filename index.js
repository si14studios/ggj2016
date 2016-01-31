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

    socket.on('stream input', function(input, user, target) {
        socket.broadcast.emit('display input', input, user, target);
    });

    socket.on('begin match', function() {

        var dealto = Object.keys(users);
        var dealfrom = Object.keys(users);
        for (var to = 0; to < dealto.length; to++) {
          var choice = dealfrom[Math.floor(Math.random() * dealfrom.length)];
          while (choice == dealto[to]) {
            choice = dealfrom[Math.floor(Math.random() * dealfrom.length)];
          }
          socket.broadcast.emit('deal target', choice, dealto[to]);
        }
    });

    socket.on('announce death', function(killed) {
      delete users[killed];
      socket.broadcast.emit('announce death', killed);
    });

    socket.on('request new target', function(uname) {

      var dealfrom = Object.keys(users);
      var choice = dealfrom[Math.floor(Math.random() * dealfrom.length)];
      while (choice == uname) {
        choice = dealfrom[Math.floor(Math.random() * dealfrom.length)];
      }
      io.sockets.emit('deal target', choice, uname);
    });

    socket.on('release player', function(username) {
      socket.broadcast.emit('release player', username);
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
    
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
      console.log('To play, type this IP into the browser of your choice: '+add);
    })
});
