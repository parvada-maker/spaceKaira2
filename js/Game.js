class Game {
  constructor() {
    
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
    this.leftKeyActive = false;
    this.blast = false;
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    spaceship1 = createSprite(width / 2 - 50, height - 100);
    spaceship1.addImage("spaceship1", spaceship1_img);
    spaceship1.scale = 0.07;

    spaceship1.addImage("blast", blastImage);

    spaceship2 = createSprite(width / 2 + 100, height - 100);
    spaceship2.addImage("spaceship2", spaceship2_img);
    spaceship2.scale = 0.07;

    spaceship2.addImage("blast", blastImage);

    spaceships = [spaceship1, spaceship2];

   

    satellites = new Group();
   

  
    

    //Adding obstacles sprite in the game
    this.addSprites(
      satellites,
      50,
      satellite1_img,
      0.09
    );
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

   
        x = random(100, width-100);
        y = random(height * 5, height );
    
      var sprite = createSprite(x, y);
     
      sprite.addImage("sprite", spriteImage);
      var rotdirection=random(-70,70)
      sprite.rotation= rotdirection;
     
     sprite.setSpeed(random(1,4), rotdirection);
      sprite.scale = scale;
     
      spriteGroup.add(sprite);
    }
  }

  handleElements() {
    form.greeting.hide();
    form.playButton.hide();
    form.input.hide();


    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Leaderboard");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getPlayersAtEnd();

    if (allPlayers !== undefined) {
      image(space_background, 0, 0, width, height * 6);

      
      this.showLeaderboard();

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
          //add 1 to the index for every loop
          index = index + 1;

          //use data form the database to display the cars in x and y direction
          var x = allPlayers[plr].positionX;
          var y = height - allPlayers[plr].positionY;

          var currentlife = allPlayers[plr].life;

          if (currentlife <= 0) {
            spaceships[index - 1].changeImage("blast");
            spaceships[index - 1].scale = 0.3;
        }

        spaceships[index - 1].position.x = x;
        spaceships[index - 1].position.y = y;

        if (index === player.index) {
          push();
          fill("white");
          textFont('Verdana');
          strokeWeight(2);
          text.size=30
          text
          text("my ship",x,y-100)

          text("life:  "+player.life,x,y-50)
          pop();
        
          this.handleSpaceship1CollisionWithSpaceship2(index);
          this.handleSatelliteCollision(index);

          if (player.life <= 0) {
            this.blast = true;
            this.playerMoving = false;
          }

          // Changing camera position in y direction
          camera.position.y = spaceships[index - 1].position.y;
        }
      }

      if (this.playerMoving) {
        player.positionY -= 5;
        player.update();
      }

      // handling keyboard events
      this.handlePlayerControls();

      // Finshing Line
      const finshLine = -(3000);

      if (player.positionY < finshLine) {
        gameState = 2;
        player.rank += 1;
        Player.updatePlayersAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      drawSprites();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        playersAtEnd: 0
      });
      window.location.reload();
    });
  }

  showLife() {
    push();
    fill("white")
   text("life:"+player.life,player.x-100,player.y-100)
    pop();
  }


  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        (-1 *(players[0].positionY));

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        (-1 *(players[1].positionY));
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        (-1 *(players[1].positionY));

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        (-1*(players[0].positionY));
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
    if (!this.blast) {
      if (keyIsDown(DOWN_ARROW)) {
        this.playerMoving = true;
        player.positionY -= 10;
        player.update();
      }

      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
        this.leftKeyActive = true;
        player.positionX -= 5;
        player.update();
      }

      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
        this.leftKeyActive = false;
        player.positionX += 5;
        player.update();
      }
    }
  }

  
  

  handleSatelliteCollision(index) {
    if (spaceships[index - 1].collide(satellites)) {
    
      if (this.leftKeyActive) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }

      //Reducing Player Life
      if (player.life > 0) {
        player.life=player.life-1;
      }

      player.update();
    }
  }

  handleSpaceship1CollisionWithSpaceship2(index) {
    if (index === 1) {
      if (spaceships[index - 1].collide(spaceships[1])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        //Reducing Player Life
        if (player.life > 0) {
          player.life -= 1
        }

        player.update();
      }
    }
    if (index === 2) {
      if (spaceships[index - 1].collide(spaceships[0])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        //Reducing Player Life
        if (player.life > 0) {
          player.life -=1;
        }

        player.update();
      }
    }
  }

  showRank() { fill('white');
  textSize(30)
  text (" you won.. congratulations"+ player.name+"your rank is "+player.rank, width-100,-3030)
   
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You reached the finish line successfully",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Game Over`,
      text: "Oops you lost the race....!!!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks For Playing"
    });
    fill('white');
    textSize(30)
    text (" oops u lost"+ player.name+"your rank is "+player.rank, width-100,-3030)
  }

  end() {
    
    console.log(player.name)
    console.log(player.positionY)
    console.log("Game Over");
  }
}
