function controller() {
  $('figure').on('touchstart click', function(e) {
                var username = $('#inline-name').val();
                var ch = $(this).attr('id');

                if (username && ch) {

                    var pressed = [];
                    var target = 'none';

                    pressed['up'] = false;
                    pressed['right'] = false;
                    pressed['left'] = false;
                    pressed['a'] = false;

                    socket.emit('register user', username, ch);
                    // setup new screen
                    $('#register').hide();
                    $('#play').show();
                    $('#name').text('Name: ' + username);
                    $('#character').text('Character: ' + ch);


                    socket.on('deal target', function(targ, person) {
                        console.log('ping');
                        if (username == 'person') {
                            target = targ;
                            $('#instructions').append('New Target: ' + target);
                        }
                    });

                    kd.run(function () {
                        kd.tick();

                        if (pressed['up']) {
                            socket.emit('stream input', 'up', username);
                        }
                        if (pressed['a']) {
                            socket.emit('stream input', 'a', username);
                        }
                        if (pressed['right']) {
                            socket.emit('stream input', 'right', username);
                        }
                        if (pressed['left']) {
                            socket.emit('stream input', 'left', username);
                        }
                    });
                    // RIGHT
                    kd.RIGHT.press(function() {
                        $('#right').attr('src', '/assets/keys/dark-right.png');
                    });
                    kd.RIGHT.down(function() {
                        socket.emit('stream input', 'right', username);
                    });
                    kd.RIGHT.up(function() {
                        $('#right').attr('src', '/assets/keys/line-right.png');
                    });

                    // LEFT
                    kd.LEFT.press(function() {
                        $('#left').attr('src', '/assets/keys/dark-left.png');
                    });
                    kd.LEFT.down(function() {
                        socket.emit('stream input', 'left', username);
                    });
                    kd.LEFT.up(function() {
                        $('#left').attr('src', '/assets/keys/line-left.png');
                    });

                    // UP
                    kd.UP.press(function() {
                        $('#up').attr('src', '/assets/keys/dark-up.png');
                    });
                    kd.UP.down(function() {
                        socket.emit('stream input', 'up', username);
                    });
                    kd.UP.up(function() {
                        $('#up').attr('src', '/assets/keys/line-up.png');
                    });

                    // A
                    kd.DOWN.press(function() {
                        $('#a').attr('src', '/assets/keys/dark-a.png', username);
                    });
                    kd.DOWN.down(function() {
                        socket.emit('stream input', 'a', username);
                    });
                    kd.DOWN.up(function() {
                        $('#a').attr('src', '/assets/keys/line-a.png');
                    });

                    // Press Up
                    $('.shield.up').on('touchstart', function(e) {
                        pressed['up'] = true;
                        $('#up').attr('src', '/assets/keys/dark-up.png');
                    });
                    $('.shield.up').on('touchend', function(e) {
                        pressed['up'] = false;
                        $('#up').attr('src', '/assets/keys/line-up.png');
                    });
                    // Press A
                    $('.shield.a').on('touchstart', function(e) {
                        pressed['a'] = true;
                        $('#a').attr('src', '/assets/keys/dark-a.png', username);
                    });
                    $('.shield.a').on('touchend', function(e) {
                        pressed['a'] = false;
                        $('#a').attr('src', '/assets/keys/line-a.png');
                    });

                    // Press Left
                    $('.shield.left').on('touchstart', function(e) {
                        pressed['left'] = true;
                        $('#left').attr('src', '/assets/keys/dark-left.png');
                    });
                    $('.shield.left').on('touchend', function(e) {
                        pressed['left'] = false;
                        $('#left').attr('src', '/assets/keys/line-left.png');
                    });
                    // Press Right
                    $('.shield.right').on('touchstart', function(e) {
                        pressed['right'] = true;
                        $('#right').attr('src', '/assets/keys/dark-right.png');
                    });
                    $('.shield.right').on('touchend', function(e) {
                        pressed['right'] = false;
                        $('#right').attr('src', '/assets/keys/line-right.png');
                    });
                }
            });
}
