function controller() {
  $('figure').on('touchstart click', function(e) {
                var username = $('#inline-name').val();
                var ch = $(this).attr('id');

                if (username && ch) {

                    var pressed = [];
                    var target = 'none';
                    var life = true;

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
                        if (username == person) {
                            target = targ;
                            console.log('WE MADE IT BOYDS');
                            $('#instructions').append('<p>New Target: ' + target + '</p>');
                        }
                    });

                    socket.on('release player', function(uname) {
                      console.log('releasing');
                      if(username == uname) {
                        console.log('you died');
                        life = false;
                        location.reload();
                      }
                    });

                    socket.on('announce death', function(killed) {
                      console.log('rip: ' + killed)
                      if (killed == target) {
                        // request new target
                        console.log('requesting new target')
                        socket.emit('request new target', username);
                      }
                    });

                    kd.run(function () {
                        kd.tick();

                        if (pressed['up']) {
                            socket.emit('stream input', 'up', username, target);
                        }
                        if (pressed['a']) {
                            socket.emit('stream input', 'a', username, target);
                        }
                        if (pressed['right']) {
                            socket.emit('stream input', 'right', username, target);
                        }
                        if (pressed['left']) {
                            socket.emit('stream input', 'left', username, target);
                        }
                    });
                    // RIGHT
                    kd.RIGHT.press(function() {
                        $('#right').attr('src', '/assets/keys/dark-right.png');
                    });
                    kd.RIGHT.down(function() {
                        socket.emit('stream input', 'right', username, target);
                    });
                    kd.RIGHT.up(function() {
                        $('#right').attr('src', '/assets/keys/line-right.png');
                    });

                    // LEFT
                    kd.LEFT.press(function() {
                        $('#left').attr('src', '/assets/keys/dark-left.png');
                    });
                    kd.LEFT.down(function() {
                        socket.emit('stream input', 'left', username, target);
                    });
                    kd.LEFT.up(function() {
                        $('#left').attr('src', '/assets/keys/line-left.png');
                    });

                    // UP
                    kd.UP.press(function() {
                        $('#up').attr('src', '/assets/keys/dark-up.png', target);
                    });
                    kd.UP.down(function() {
                        socket.emit('stream input', 'up', username);
                    });
                    kd.UP.up(function() {
                        $('#up').attr('src', '/assets/keys/line-up.png', target);
                    });

                    // A
                    kd.DOWN.press(function() {
                        $('#a').attr('src', '/assets/keys/dark-a.png', username);
                    });
                    kd.DOWN.down(function() {
                        socket.emit('stream input', 'a', username, target);
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
                        $('#a').attr('src', '/assets/keys/dark-a.png');
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
