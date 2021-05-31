class Player {
  constructor(game, x=100, y=560) {
    this.color = "#ff0000"
    this.height = 20
    this.width = 20
    this.alive = true

    this.jumping = true
    
    this.velocityX = 0
    this.velocityY = 0
    this.x = x
    this.y = y
    
    this.onPlatform = false

    this.sideBonus = false
    this.onBonus = false


    // AI stuff
    this.game = game
    this.fitness = 0;
    this.vision = []; //the input array fed into the neuralNet
    this.decision = []; //the out put of the NN
    this.unadjustedFitness;
    this.lifespan = 0; //how long the player lived for this.fitness
    this.bestScore = 0; //stores the this.score achieved used for replay
    this.dead = false;
    this.score = 0;
    this.gen = 0;

    this.genomeInputs = 4;
    this.genomeOutputs = 3;
    this.brain = new Genome(this.genomeInputs, this.genomeOutputs);
  }

  jumpVelocity = () => {
    const bonus = this.sideBonus ? 30 : 0
    return 20 + 1.3*Math.abs(this.velocityX) + bonus
  }

  genColor = () => { 
    return "hsl(" + 360 * Math.random() + ',' +
               (80 + 20 * Math.random()) + '%,' + 
               (50 + 10 * Math.random()) + '%)'
  }

  jump = () => {

    if(!this.jumping) {
      // this.color = `#${Math.floor(Math.random() * 16777216).toString(16)}`
      this.color = this.genColor()

      this.velocityY -= this.jumpVelocity()

      this.jumping = true
      this.sideBonus = false
    }

  }

  moveLeft = () => {
    this.velocityX -= 2
  }

  moveRight = () => {
    this.velocityX += 2
  }

  update = () => {
    if (this.alive) {
      this.x += this.velocityX
      this.y += this.velocityY

      if (Math.abs(this.velocityX) < .05) {
        this.velocityX = 0
      }
      if (Math.abs(this.velocityY) < .05) {
        this.velocityY = 0
      }

      this.look()
      this.think()
    }
  }

  // AI stuff
  look() {
    this.vision = [];
    this.vision[0] = map(this.velocityY, -15, 15, -1, 1); //ai can tell its current y velocity
    this.vision[1] = map(this.velocityX, -15, 15, -1, 1); //ai can tell its current x velocity

    const platforms = this.game.platforms
    let closestPlatform
    for (let platform of platforms) {
      if (platform.y < this.y) {
        closestPlatform = platform
        break
      }
    }

    if (closestPlatform === undefined) {
      closestPlatform = platforms[platforms.length-1]
    }

    const leftSide = closestPlatform.x
    const rightSide = closestPlatform.x + closestPlatform.length

    let distanceX
    if (this.x >= leftSide && this.x <= rightSide) {
      distanceX = 0
    } else if (this.x < leftSide) {
      distanceX = leftSide - this.x
    } else {
      distanceX = this.x - rightSide
    }

    this.vision[2] = map(distanceX, 0, this.game.width - this.x, 1, 0) // Distance x to closest platform
    this.vision[3] = map(Math.abs(closestPlatform.y-this.y), 0, this.game.height-this.y, 0, 1) // Distance y to closest platform

    // console.log("What we see: ", this.vision)
  }


  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  //gets the output of the this.brain then converts them to actions
  think() {
    //get the output of the neural network
    this.decision = this.brain.feedForward(this.vision);
    // console.log("We're thinking this: ", this.decision)
    if (this.decision[0] > 0.6) {
      this.jump();
    }

    if (this.decision[1] > 0.6) {
      this.moveLeft()
    }

    if (this.decision[2] > 0.6) {
      this.moveRight()
    }

  }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    //returns a clone of this player with the same brian
  clone() {
    var clone = new Player();
    clone.brain = this.brain.clone();
    clone.fitness = this.fitness;
    clone.brain.generateNetwork();
    clone.gen = this.gen;
    clone.bestScore = this.score;
    // print("cloning done");
    return clone;
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //since there is some randomness in games sometimes when we want to replay the game we need to remove that randomness
  //this fuction does that

  cloneForReplay() {
    var clone = new Player();
    clone.brain = this.brain.clone();
    clone.fitness = this.fitness;
    clone.brain.generateNetwork();
    clone.gen = this.gen;
    clone.bestScore = this.score;

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    return clone;
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  //fot Genetic algorithm
  calculateFitness() {
    this.fitness = 1 + this.score * this.score + this.lifespan / 20.0;
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  crossover(parent2) {

    var child = new Player();
    child.brain = this.brain.crossover(parent2.brain);
    child.brain.generateNetwork();
    return child;
  }

}