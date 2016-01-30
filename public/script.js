var socket = io();
var role = 'unassigned';

$(document).ready(function() {
    $('#butt').on('click', function(){
        console.log('pinging mission control')
        socket.emit('speak', 'PING PING YY');
  });
});
socket.on('speak', function(msg){
  console.log('captain, weve been pinged')
});
socket.on('assign role', function(r) {
    role = r;
    console.log('Your role is: ' + role);
});
