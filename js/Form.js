class Form {
  constructor() {

    this.instructions=createElement("h2");
   

    this.input = createInput("Enter your name");
    this.playButton = createButton("Play");

    //not necessary
    this.titleImg = createImg("./assets/title.png", "game title");


    this.greeting = createElement("h2");
  }

  setElementsPosition() {
    
  }

  setElementsStyle() {

    this.titleImg.class("gameTitle");
    this.input.class("customInput");
    this.playButton.class("customButton");
    this.greeting.class("greeting");
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  

  display() {
    this.instructions.html("this is instructions")
    this.instructions.position(width/2,height/2)
    this.titleImg.position(120, 50);
    this.input.position(width / 2 - 110, height / 2 - 80);
    this.playButton.position(width / 2 - 90, height / 2 - 20);
    this.greeting.position(width / 2 - 300, height / 2 - 100);
    this.setElementsStyle();
    
    this.playButton.mousePressed(() => {
      this.input.hide();
      this.playButton.hide();
      this.instructions.hide();
      var message = `Hello ${this.input.value()}</br>wait for another player to join...`;
      this.greeting.html(message);
      playerCount += 1;
      player.name = this.input.value();
      player.index = playerCount;
      player.addPlayer();
      player.updateCount(playerCount);
      player.getDistance();
    });
  }
}
