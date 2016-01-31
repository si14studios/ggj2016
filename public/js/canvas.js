var socket = io();
var role = 'unassigned';

socket.on('assign role', function(r) {
    role = r;
    $(role).show();

    $(document).ready(function() {

        if (role == 'display') {
			display();
        }
        else if (role == 'controller') {
        	controller();
        }
        else {
            console.log('None of the above');
        }
    });

});

socket.on('request role', function() {
    socket.emit('send role', role);
});

socket.on('request check in', function() {
    socket.emit('check in', role);
})
