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

const sum = (arr) => {
  let sum = 0
  for (el of arr) {
    sum += el
  }

  return sum
}

const max = Math.max
const min = Math.min
const pow = Math.pow
const abs = Math.abs

let nextConnectionNo = 1000;

let generationCounter = 1;

let population

const maxStalemate = 150

let jumpBias = 10
let leftBias = 7
let rightBias = 7
let populationSize = 1000
let gameSpeed = 66

const playGame = () => {
  let stalemate = 0

  const app = document.getElementById("app")
  const scoreTable = document.getElementsByClassName("scoreTable")
  const size = document.getElementById("size")
  const startBtn = document.getElementById("startBtn")

  const jumpBiasHolder = document.getElementById("jBias")
  const leftBiasHolder = document.getElementById("lBias")
  const rightBiasHolder = document.getElementById("rBias")

  const newRun = document.getElementById("newRun")
  const speed = document.getElementById("speed")

  size.innerHTML = populationSize
  jumpBiasHolder.innerHTML = jumpBias
  leftBiasHolder.innerHTML = leftBias
  rightBiasHolder.innerHTML = rightBias

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

    gameStart = false
    display.render()
  }

  const update = time => {
    size.innerHTML = populationSize
    jumpBiasHolder.innerHTML = jumpBias
    leftBiasHolder.innerHTML = leftBias
    rightBiasHolder.innerHTML = rightBias
    engine.timeStep = 100-gameSpeed
    speed.innerHTML = gameSpeed

    
    stalemate++
    if (stalemate >= maxStalemate && !game.start) {
      game.start = true
    }

    if (controller.stop.active) {
      engine.stop()
      console.log("STOP")
      return
    }

    // Change population size
    population.size = populationSize
    
    if(game.update()) {
      engine.stop()
      // displayPopup()
      console.log("Whole generation is dead")
      startBtn.removeEventListener("click", controlEngine)
      playGame()
    }
  }


  const controller = new Controller()
  const display = new Display(app, scoreTable)
  const game = new Game()

  if (generationCounter === 1) {
    population = new Population(populationSize, game)
    game.population = population
    generationCounter++
  } else {
    population.naturalSelection()
    population.setNewGame(game)
    game.population = population
    generationCounter++

    console.log(population)
  }

  const engine = new Engine(100-gameSpeed, render, update)

  display.buffer.canvas.height = game.height
  display.buffer.canvas.width = Game.width

  window.addEventListener("keydown", keyDownUp)
  window.addEventListener("keyup", keyDownUp)

  engine.start()

  const controlEngine = () => {
    if (engine.finished) {
      console.log("START")
      engine.start()
    } else {
      console.log("STOP")
      engine.stop()
    }
  } 

  startBtn.addEventListener("click", controlEngine)
}


window.addEventListener("load", () => {
  const decSize = document.getElementById("decSize")
  const incSize = document.getElementById("incSize")
  const size = document.getElementById("size")
  size.innerHTML = populationSize

  decSize.addEventListener("click", () => {
    populationSize -= 100
    size.innerHTML = populationSize
  })

  incSize.addEventListener("click", () => {
    populationSize += 100
    size.innerHTML = populationSize
  })

  const decJumpBias = document.getElementById("decJumpBias")
  const incJumpBias = document.getElementById("incJumpBias")
  const jumpBiasHolder = document.getElementById("jBias")

  const decLeftBias = document.getElementById("decLeftBias")
  const incLeftBias = document.getElementById("incLeftBias")
  const leftBiasHolder = document.getElementById("lBias")

  const decRightBias = document.getElementById("decRightBias")
  const incRightBias = document.getElementById("incRightBias")
  const rightBiasHolder = document.getElementById("rBias")

  jumpBiasHolder.innerHTML = jumpBias
  leftBiasHolder.innerHTML = leftBias
  rightBiasHolder.innerHTML = rightBias

  decJumpBias.addEventListener("click", () => {
    jumpBias -= 1
    jumpBiasHolder.innerHTML = jumpBias
  })

  incJumpBias.addEventListener("click", () => {
    jumpBias += 1
    jumpBiasHolder.innerHTML = jumpBias
  })


  decLeftBias.addEventListener("click", () => {
    leftBias -= 1
    leftBiasHolder.innerHTML = leftBias
  })

  incLeftBias.addEventListener("click", () => {
    leftBias += 1
    leftBiasHolder.innerHTML = leftBias
  })


  decRightBias.addEventListener("click", () => {
    rightBias -= 1
    rightBiasHolder.innerHTML = rightBias
  })

  incRightBias.addEventListener("click", () => {
    rightBias += 1
    rightBiasHolder.innerHTML = rightBias
  })

  const decSpeed = document.getElementById("decSpeed")
  const incSpeed = document.getElementById("incSpeed")
  const speed = document.getElementById("speed")

  decSpeed.addEventListener("click", () => {
    if (gameSpeed > 1) { 
      gameSpeed -= 1
    }
    speed.innerHTML = gameSpeed
  })

  incSpeed.addEventListener("click", () => {
    if (gameSpeed < 99) {
      gameSpeed += 1
    }
    speed.innerHTML = gameSpeed
  })

  speed.innerHTML = gameSpeed

  const run = document.getElementById("run").addEventListener("click", e => {
    e.target.disabled = true
    playGame()
  })

}) 