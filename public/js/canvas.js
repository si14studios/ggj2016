var stage = new createjs.Stage("gameCanvas");

function init() {
  socketRun();
  addArcherRun();
  ticker();
  stage.update();
}

function handleTick(event) {
  stage.update(event);
  console.log("what up son");
}

function ticker() {
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick",handleTick);
}

function addArcherRun() {
  var archerRunImage = new Image();
  archerRunImage.src = "../assets/sprites/archer/Ranger/3x/archerRunSpriteSheet.png";

  var archerRunSpriteSheet = new createjs.SpriteSheet({
    framerate: 5,
    images: [archerRunImage],
    frames: {width: 120, height: 87},
    animations: {
        walk: [0, 4]
    }
  });

  var archerRunSprite = new createjs.Sprite(archerRunSpriteSheet, "walk");
  archerRunSprite.y = 50;
  archerRunSprite.x = 50;
  stage.addChild(archerRunSprite);
}
//------------------------------------------------------------------------------
//Socket stuff that peter said I needed in the file
function socketRun() {
  var socket = io();
  var role = 'unassigned';

  $(document).ready(function() {});

  socket.on('assign role', function(r) {
    role = r;
    $('body').append('Role: ' + role);
  });

  socket.on('request role', function() {
      socket.emit('send role', role);
  });

  socket.on('request check in', function() {
     socket.emit('check in', role);
  });

}
