var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  socket.on('speak', function(msg){
    io.emit('speak', 'message?');
    console.log('ping received with payload: ' + msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
