var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.use(express.static(__dirname + '/public'));

var hasDisplay = false;

io.on('connection', function(socket){

  if(!hasDisplay) {
      hasDisplay = true;
      io.emit('assign role', 'display');
  } else {
      io.emit('assign role', 'controller');
  }

  io.on('disconnection')

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
