

var canvas;
var backgroundImage, spaceship1_img, spaceship2_img, space_background;
var fuelImage, powerCoinImage, lifeImage;
var satellite1_img, satellite2_img;
var database, gameState;
var blastImage;
var form, player, playerCount;
var allPlayers, spaceship1, spaceship2, fuels, powerCoins, satellites;
var spaceships = [];

function preload() {
  backgroundImage = loadImage("./assets/spacebackground.jpeg");
  spaceship1_img = loadImage("../assets/spaceship1.png");
  spaceship2_img = loadImage("../assets/spaceship2.png");
  space_background = loadImage("../assets/spacewithfinishingline.png");
  fuelImage = loadImage("./assets/fuel.png");
  powerCoinImage = loadImage("./assets/goldCoin.png");
  satellite1_img = loadImage("./assets/satellite.png");
  satellite2_img = loadImage("./assets/satellite.png");
  lifeImage = loadImage("./assets/life.png");
  blastImage = loadImage("./assets/blast.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }

  if (gameState === 2) {
    game.showLeaderboard();
    game.end();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
