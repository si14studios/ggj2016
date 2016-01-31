//Sprite varibles
var players;
var platforms;

var characters = [];
characters["gentleman"] = makePlayer({
  x: 0, y: 0, width: 40, height: 50, veldx: 0, veldy: 0, sprite: "../assets/spriteSheets/gentleman - sprite_sheet.png"
});
characters["mechanic"] = makePlayer({
  x: 0, y: 0, width: 40, height: 50, veldx: 0, veldy: 0, sprite: "../assets/spriteSheets/mechanic - sprite_sheet.png"
});
characters["ninja"] = makePlayer({
  x: 0, y: 0, width: 40, height: 50, veldx: 0, veldy: 0, sprite: "../assets/spriteSheets/ninja - sprite_sheet.png"
});
characters["pirate"] = makePlayer({
  x: 0, y: 0, width: 40, height: 50, veldx: 0, veldy: 0, sprite: "../assets/spriteSheets/pirate - sprite_sheet.png"
});
characters["ranger"] = makePlayer({
  x: 0, y: 0, width: 40, height: 50, veldx: 0, veldy: 0, sprite: "../assets/spriteSheets/ranger - sprite_sheet.png"
});
characters["viking"] = makePlayer({
  x: 0, y: 0, width: 40, height: 50, veldx: 0, veldy: 0, sprite: "../assets/spriteSheets/viking - sprite_sheet.png"
});

//Main function
function display() {
  // Boring library inits

  socket.on('add user', function(uname, character) {
      $('ul').append('<li>' + uname + ' (' + character + ') </li>');
      var player = makePlayer({
        x: 0, y: 0, width: 40, height: 50, veldx: 0, veldy: 0, username: uname, sprite: "../assets/spriteSheets/" + character + " - sprite_sheet.png"
      });

      players[uname] = player;
      stage.addChild(player);

      console.log(players);
  });
  socket.on('remove user', function(username) {

  });
  socket.on('display input', function(input, uname) {
      console.log(uname + ': ' + input);
          if (input == 'up') {
              players[uname].vel.dy = -10;
          }
          if (input == 'right') {
              players[uname].vel.dx += 2;
          }
          if (input == 'left') {
              players[uname].vel.dx += -2;
          }
          if (input == 'down') {

          }

  });

  $('#begin').click(function() {
      socket.emit('begin match');
  });

  // controls

/*
  kd.RIGHT.down(function () {
      players[0].vel.dx += 2;
  });
  kd.LEFT.down(function() {
      players[0].vel.dx += -2;
  });
  Mousetrap.bind('up', function() {
      players[0].vel.dy = -10;
      //characters["ranger"].gotoAndPlay("jump");
  }, 'keydown');
*/

  // Movement Animation
  /*Mousetrap.bind('up', function() {characters["ranger"].gotoAndStop("jump"); characters["ranger"].gotoAndPlay("walk")}, 'keyup');
  Mousetrap.bind('right', function() {characters["ranger"].gotoAndPlay("walk");}, 'keydown');
  Mousetrap.bind('right', function() {characters["ranger"].gotoAndPlay("idle");}, 'keyup');
  Mousetrap.bind('left', function() {characters["ranger"].gotoAndPlay("walk");}, 'keydown');
  Mousetrap.bind('left', function() {characters["ranger"].gotoAndPlay("idle");}, 'keyup');
  Mousetrap.bind('down', function() {characters["ranger"].gotoAndPlay("attack");}, 'keydown');
  Mousetrap.bind('down', function() {characters["ranger"].gotoAndPlay("idle");}, 'keyup');
  */
  //$(document).mousem


  // [stage setup]
  // Make canvas full screen
  var canvas = document.getElementById('gameCanvas');
  canvas.height = window.innerHeight - 50;
  canvas.width = window.innerWidth;

  // Make canvas not blurry
  var context = canvas.getContext('2d');
  context.webkitImageSmoothingEnabled = false;
  context.mozImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;

  stage = new createjs.Stage("gameCanvas");
  // [/stage setup]

  // Setup ticker
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick",handleTick);

  //var level = makeLevel();
  //stage.addChild(level);

  players = [];
  platforms = [];
  makeLevel();
}

//Creates handleTick function to handle the tick
function handleTick(event) {
  stage.update(event);
  kd.tick()

  var keys = Object.keys(players);
  for (var i = 0; i < keys.length; i++) {

      // player
      var play = players[keys[i]];

      // update player position
      play.x += play.vel.dx;
    play.y += play.vel.dy;

      // sync rectangle with positon
      play.rect.x = play.x + 35;
      play.rect.y = play.y + 26;

      // Apply gravity
    var grav = 1 - 0.01;
    play.vel.dy += grav;

      // Apply friction
      var tolerance = 0.5
      if (play.vel.dx > tolerance || play.vel.dx < -tolerance) {
          var friction = 0.8;
          //var s = (play.vel.dx > 0) ? -1 : 1;
          play.vel.dx *= (friction);
    } else {
          play.vel.dx = 0;
      }

      // Detect collisions on all platforms
      for(var j = 0; j < platforms.length; j++) {

          // platform
          var plat = platforms[j];

          var result = collides(play.rect, plat);
          var collided = result.bool;
          var overlap = result.overlap;
          if (collided) {
              if (overlap.x > 0) {
                  play.vel.dx = 0;
              }
              if (overlap.y > 0) {
                  play.vel.dy = 0;
              }
              play.x -= overlap.x;
              play.y -= overlap.y;
          }
      }
  }
}

//All collisions relative to player
//(player, rectangle)
function collides(rect1, rect2) {
  var a = new SAT.Box(new SAT.Vector(rect1.x,rect1.y), rect1.width, rect1.height).toPolygon();
  var b = new SAT.Box(new SAT.Vector(rect2.x,rect2.y), rect2.width, rect2.height).toPolygon();
  var response = new SAT.Response();
  var collided = SAT.testPolygonPolygon(a, b, response);
  return {bool: collided, overlap: response.overlapV};
}

function makeSpriteSheet(x) {
  var spriteImage = new Image();
  spriteImage.src = x;

  spriteSheet = new createjs.SpriteSheet({
    framerate: 20,
    images: [x],
    frames: {width: 120, height: 87},
    animations: {
        walk: [18, 23],
              idle: {
                  frames: [7, 9],
                  speed: 0.2
              },
              jump: {
                  frames: [12,15],
                  speed: 0.2
              },
        attack: {
          frames: [0,2],
          speed: 0.5
        }
    }
  });

  return spriteSheet;
}

// {x: ?, y: ?, width: ?, height: ?, veldx: ?, veldy: ?, sprite: ?, username: ?}
function makePlayer(prop) {
  // setup characters
  var ss = makeSpriteSheet(prop.sprite);
  var player = new createjs.Sprite(ss, "idle");

  player.x = prop.x;
  player.y = prop.y;
  player.rect = {x: player.x, y: player.y, width: prop.width, height: prop.height}
  player.vel = {dx: prop.veldx, dy: prop.veldy};
  player.username = prop.username;


  return player;
}

function makePlatform(info) {
  var rect = {
      x: info.x,
      y: info.y,
      width: info.width,
      height: info.height
  };

  var rectShape = new createjs.Shape();
  rectShape.graphics.beginFill("black").drawRect(rect.x, rect.y, rect.width, rect.height);
  rect.shape = rectShape;

  return rect;
}

function makeLevel() {
  var level = {};
  level.floor = makePlatform({x: 0,y: (window.innerHeight - 55),width: (window.innerWidth),height: 10});
  platforms.push(level.floor);
  stage.addChild(level.floor.shape);
  level.ceiling = makePlatform({x: 0, y: 0, width: (window.innerWidth), height: 10});
  platforms.push(level.ceiling);
  stage.addChild(level.ceiling.shape);

  for (i = 0; i < 7; i++) {
    var platInfo = {
      x: (Math.random() * window.innerWidth) + 87,
      y: (Math.random() * window.innerHeight) + 87,
      width: ((Math.random() * 100) + 50) * 4,
      height: ((Math.random() * 100) + 50) * 2
    }
    var platform = makePlatform(platInfo);
    for(var j = 0; j < platforms.length; j++) {
      while(collides(platform, platforms[j]).bool) {
        platInfo = {
          x: (Math.random() * window.innerWidth) + 87,
          y: (Math.random() * window.innerHeight) + 87,
          width: ((Math.random() * 100) + 50) * 4,
          height: ((Math.random() * 100) + 50) * 2
        }
        platform = makePlatform(platInfo);
    }
  }

  platforms.push(platform);
  console.log(platform.x + " " + platform.y);
  stage.addChild(platform.shape);
}
  return level;
}
