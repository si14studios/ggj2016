function controller() {
  $('figure').on('touchstart click', function(e) {
                var n = $('#inline-name').val();
                var ch = $(this).attr('id');

                if (n && ch) {
                    socket.emit('register user', {name: n, character: ch});
                    // setup new screen
                    $('#register').hide();
                    $('#play').show();
                    $('#name').text('Name: ' + n);
                    $('#character').text('Character: ' + ch);

                    kd.run(function () {
                        kd.tick();
                    });
                    // RIGHT
                    kd.RIGHT.press(function() {
                        $('#right').attr('src', '/keys/dark-right.png');
                    });
                    kd.RIGHT.down(function() {
                        socket.emit('stream input', 'right');
                    });
                    kd.RIGHT.up(function() {
                        $('#right').attr('src', '/keys/line-right.png');
                    });

                    // LEFT
                    kd.LEFT.press(function() {
                        $('#left').attr('src', '/keys/dark-left.png');
                    });
                    kd.LEFT.down(function() {
                        socket.emit('stream input', 'left');
                    });
                    kd.LEFT.up(function() {
                        $('#left').attr('src', '/keys/line-left.png');
                    });

                    // UP
                    kd.UP.press(function() {
                        $('#up').attr('src', '/keys/dark-up.png');
                    });
                    kd.UP.down(function() {
                        socket.emit('stream input', 'up');
                    });
                    kd.UP.up(function() {
                        $('#up').attr('src', '/keys/line-up.png');
                    });

                    // A
                    kd.DOWN.press(function() {
                        $('#a').attr('src', '/keys/dark-a.png');
                    });
                    kd.DOWN.down(function() {
                        socket.emit('stream input', 'a');
                    });
                    kd.DOWN.up(function() {
                        $('#a').attr('src', '/keys/line-a.png');
                    });

                    $('#a').on('mouseup', function(e) {
                        socket.emit('stream input', 'ping');
                        //alert('hit');
                    });
                }
            });
}
