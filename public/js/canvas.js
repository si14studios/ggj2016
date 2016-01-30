function init() {
//Creates the Game Stage
var stage = new createjs.Stage("gameCanvas");

//Creates game ticker and function tick()
createjs.Ticker.addEventListener("tick",tick);
createjs.Ticker.setFPS(60);
createjs.Ticker.on("Tick",handleTick);
function tick() {console.log("*");}

var archerRunSpriteSheet = new Image();
archerRunSpriteSheet.src = "../assets/sprites/archer/Ranger/3x/archerRunSprSh.png";

var archerRun = new createjs.SpriteSheet({
  images: archerRunSpriteSheet,
  frames: {regX: 0, height: 96, count: 10, regY: 0, width: 75},
  animations: {walk: [0, 9]}
});

var archer = new createjs.Sprite(archerRunSpriteSheet,"walk");
archer.play();

function handleTick(event) {
  stage.update(event);
}

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
}
