 //Sprite varibles
var players;
var platforms;
var begun = false;
var startText, titleText;

var stage;

//Main function
function display() {
  // Boring library inits

  socket.on('add user', function(uname, character) {
      var player = makePlayer({
        x: 0, y: 0, width: 40, height: 50, veldx: 0, veldy: 0, username: uname, sprite: "../assets/spriteSheets/" + character + " - sprite_sheet.png"
      });

      players[uname] = player;
      stage.addChild(player);
      stage.addChild(player.nameText);

  });
  socket.on('remove user', function(username) {

  });
  socket.on('display input', function(input, uname, utarget) {
          if (input == 'up') {
              players[uname].vel.dy = -10;
              if (players[uname].currentAnimation != "jump") {
                  players[uname].gotoAndPlay("jump");
                }
          }
          if (input == 'right') {
              players[uname].vel.dx += 2;
          if (players[uname].currentAnimation != "walk") {
              players[uname].gotoAndPlay("walk");
            }
          }
          if (input == 'left') {
              players[uname].vel.dx += -2;
              if (players[uname].currentAnimation != "walk") {
                  players[uname].gotoAndPlay("walk");
                }
          }
          if (input == 'a') {
            if (players[uname].currentAnimation != "attack") {
                players[uname].gotoAndPlay("attack");
              }

            if (begun) {
            var keys = Object.keys(players);
            for (var i = 0; i < keys.length; i++) {
              var play = players[keys[i]];
              if (play.username != uname) {
                  if (collides(play.rect, players[uname].rect).bool) {
                    var attackx = players[uname].x;
                    var victimx = play.x;
                    if (victimx - attackx > 0) {
                      play.vel.dx += 5;
                      play.vel.dy -= 2;
                    } else {
                      play.vel.dx -= 5;
                      play.vel.dy -= 2;
                    }

                    play.hp -= 2;
                    play.nameText.text = play.username + "(" + play.hp + "hp)", "10px Arial","#0000ff";

                    // killed player
                    if (play.hp < 0) {
                      if(play.username == utarget) {
                        players[uname].hp += 10;
                        play.nameText.text = play.username + "(" + play.hp + "hp)", "10px Arial","#0000ff";
                      } else {
                        players[uname].hp -= 10;
                        play.nameText.text = play.username + "(" + play.hp + "hp)", "10px Arial","#0000ff";
                      }
                    }
                  }
              }
            }
          }
          }

  });

  $('#begin').click(function() {
      socket.emit('begin match');
      begun = true;
      stage.removeChild(startText);
      stage.removeChild(titleText);
  });

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

  var titleHYPE = "Sacrifice your Friends!";
  titleText = new createjs.Text(titleHYPE, "40px Roboto", "#4DB4D6");
  titleText.x = 50;
  titleText.y = 25;
  stage.addChild(titleText);
  var story = "The evil god, Sharkmen, has created a game for his amusement.  To entertain himself, each victim has been given another combatant to kill.  If the fighter happens to kill the wrong player, the angry Sharkmen will send a furious wave of health stealing punishment to the offender. The last killer standing wins the divine, voluptuous love of Sharkmen. Let the ritual begin; welcome to Sacrifice your Friends!\n\n\n Created by Joseph Fedden and Peter Menke during Global Game Jam 2016.";
  startText = new createjs.Text(story, "25px Roboto", "#00B33C");
  startText.x = 50;
  startText.y = 100;
  startText.lineWidth = window.innerWidth - 100;
  stage.addChild(startText);
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
      play.nameText.x = play.x;
      play.nameText.y = play.y;

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

      if (play.rect.y < -5 || play.rect.y > window.innerHeight || play.hp < 0) {
        socket.emit('release player', play.username);
        stage.removeChild(play);
        stage.removeChild(play.nameText);

        // announce to the server that you are dead
        socket.emit('announce death', play.username);


        delete players[play.username];
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
        walk: [18, 23,"idle"],
          idle: {
                  frames: [7, 9],
                  speed: 0.2
              },
              jump: {
                  frames: [12,15],
                  speed: 0.2,
                  next: "idle"
              },
        attack: {
          frames: [0,2],
          speed: 0.5,
          next: "idle"
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
  player.hp = 100;
  player.nameText = new createjs.Text(prop.username + "(" + player.hp + "hp)", "20px Arial","#0000ff");
  player.nameText.x = player.x;
  player.nameText.y = player.y;


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
  stage.addChild(platform.shape);
}
  return level;
}
