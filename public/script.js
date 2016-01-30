var socket = io();
var role = 'unassigned';

$(document).ready(function() {

});

socket.on('assign role', function(r) {
    role = r;
    $('body').append('Role: ' + role);
});

socket.on('request role', function() {
    socket.emit('send role', role);
});

socket.on('request check in', function() {
    socket.emit('check in', role);
})
