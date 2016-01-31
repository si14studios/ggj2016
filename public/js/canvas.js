//Sprite varibles
var players;
var platforms;

var characters = [];
characters["ninja"] = makePlayer({
	x: 0, y: 0, width: 40, height: 50, veldx: 0, veldy: 0, sprite: "../assets/spriteSheets/fullSpriteSheets/gentleman - sprite_sheet.png"
});
characters["mechanic"] = makePlayer({
	x: 0, y: 0, width: 40, height: 50, veldx: 0, veldy: 0, sprite: "../assets/spriteSheets/fullSpriteSheets/mechanic - sprite_sheet.png"
});
characters["ninja"] = makePlayer({
	x: 0, y: 0, width: 40, height: 50, veldx: 0, veldy: 0, sprite: "../assets/spriteSheets/fullSpriteSheets/ninja - sprite_sheet.png"
});

//Main function
function init() {
	// Boring library inits
	socketRun();

	// controls

	kd.RIGHT.down(function () {
		players[0].vel.dx += 2;
	});
	kd.LEFT.down(function() {
		players[0].vel.dx += -2;
	});
	Mousetrap.bind('up', function() {
		players[0].vel.dy = -10;
		characters["ninja"].gotoAndPlay("jump");
	}, 'keydown');

	// Movement Animation
	Mousetrap.bind('up', function() {characters["ninja"].gotoAndStop("jump"); characters["ninja"].gotoAndPlay("walk")}, 'keyup');
	Mousetrap.bind('right', function() {characters["ninja"].gotoAndPlay("walk");}, 'keydown');
	Mousetrap.bind('right', function() {characters["ninja"].gotoAndPlay("idle");}, 'keyup');
	Mousetrap.bind('left', function() {characters["ninja"].gotoAndPlay("walk");}, 'keydown');
	Mousetrap.bind('left', function() {characters["ninja"].gotoAndPlay("idle");}, 'keyup');
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

	/*
	var archer = makePlayer({
		x: 100,
		y: 100,
		width: 40,
		height: 50,
		veldx: 0,
		veldy: 0,
		oldVel: 0,
		sprite: "../assets/spriteSheets/fullSpriteSheets/ranger - sprite_sheet.png"
	});
	stage.addChild(archer);
	*/
	//stage.addChild(characters["ninja"]);
	//stage.addChild(characters["mechanic"]);
	stage.addChild(characters["ninja"]);


  var shape = new createjs.Shape();
  shape.graphics.beginFill("#ff0000").drawRect(0, 250, 2000, 50);
  stage.addChild(shape);

	var ground = {x: 0, y: 250, width: 2000, height: 50};
	var block = makePlatform({x: 250, y: 200, width: 50, height: 50});
	console.log(block);
	stage.addChild(block.shape);

	players = [characters["ninja"]];
	console.log(players[0].animation);
	platforms = [ground, block];
}

//Creates handleTick function to handle the tick
function handleTick(event) {
  stage.update(event);
	kd.tick()

	for (var i = 0; i < players.length; i++) {
		// player
		var play = players[i];

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
				}
    }
  });

  return spriteSheet;
}

// {x: ?, y: ?, width: ?, height: ?, veldx: ?, veldy: ?, sprite: ?}
function makePlayer(prop) {
	// setup characters
	var ss = makeSpriteSheet(prop.sprite);
	var player = new createjs.Sprite(ss, "idle");

	player.x = prop.x;
	player.y = prop.y;
	player.rect = {x: player.x, y: player.y, width: prop.width, height: prop.height}
	player.vel = {dx: prop.veldx, dy: prop.veldy};


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
