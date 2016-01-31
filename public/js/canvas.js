var socket = io();
var role = 'unassigned';

socket.on('assign role', function(r) {
    role = r;
    $(role).show();

    $(document).ready(function() {

        if (role == 'display') {
            socket.on('add user', function(user) {
                $('ul').append('<li>' + user.name + ' (' + user.character + ') </li>');
            });
            socket.on('display input', function(input) {
                console.log(input);
            });

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
