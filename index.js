const floor = Math.floor
const random = (min, max) => {
  if (min !== undefined && max !== undefined) {
    return Math.random()*(max-min)+min
  }
  return Math.random()*min
}

const arrayCopy = (from, to) => {
  for (let i=0; i<from.length; i++) {
    to[i] = from[i]
  }
}

const randomGaussian = () => {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

const map = (n, start1, stop1, start2, stop2) => {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};

const max = Math.max
const min = Math.min
const pow = Math.pow
const abs = Math.abs

let nextConnectionNo = 1000;

let generationCounter = 1;

let population

const playGame = () => {

  const app = document.getElementById("app")
  const scoreTable = document.getElementsByClassName("scoreTable")

  const keyDownUp = e => {
    controller.keyDownUp(e.type, e.keyCode)
  }

  const render = time => {
    display.fill(game.backgroundColor)
    for (let player of game.population.players) {
      display.drawRectangle(player.x, player.y, player.width, player.height, player.color)
    }
    display.displayScore(game.score)
    
    // Display platforms
    for (let platform of game.platforms) {
      display.drawRectangle(platform.x, platform.y, platform.length, platform.width, platform.color)
    }

    display.render()
  }

  const update = time => {
    if (controller.stop.active) {
      engine.stop()
      console.log("STOP")
      return
    }
    // if (controller.left.active) {
    //   game.player.moveLeft()
    // }
    // if (controller.right.active) {
    //   game.player.moveRight()
    // }
    // if (controller.up.active) {
    //   game.player.jump()
    //   controller.up.active = false
    // }
    
    if(game.update()) {
      engine.stop()
      // displayPopup()
      console.log("Whole generation is dead")
      playGame()
    }
  }


  const controller = new Controller()
  const display = new Display(app, scoreTable)
  const game = new Game()

  if (generationCounter === 1) {
    population = new Population(10000, game)
    game.population = population
    generationCounter++
  } else {
    population.naturalSelection()
    population.setNewGame(game)
    game.population = population

    console.log(population)
  }



  const engine = new Engine(1000/30, render, update)

  display.buffer.canvas.height = game.height
  display.buffer.canvas.width = Game.width

  window.addEventListener("keydown", keyDownUp)
  window.addEventListener("keyup", keyDownUp)

  // document.getElementById("startBtn").addEventListener("click", () => {
    // console.log("START")
    engine.start()
  // })
}


window.addEventListener("load", playGame) 