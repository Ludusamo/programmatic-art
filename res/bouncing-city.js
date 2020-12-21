let Tween = function(f, domain) {
  this.f = f
  this.domain = domain
}

Tween.prototype.get = function(percent, scale = 1) {
  return scale * this.f((this.domain[1] - this.domain[0]) * percent + this.domain[0])
}

export const art = p => {
  let Building = function(x, y, w, h, heightTween) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.a = w * h
    this.startTime = p.millis()
    this.heightTween = heightTween
    this.windowsPerRow = p.floor(p.floor(this.w / WINDOW_WIDTH) / 2)
    this.windowRows = p.floor(p.floor(this.h / WINDOW_HEIGHT) / 3)
  }

  Building.prototype.draw = function() {
    p.push()
    p.strokeWeight(WIDTH / 200)
    let lifePercent = (p.millis() - this.startTime) / BUILDING_LIFETIME
    p.fill(p.lerp(40, 0, lifePercent))
    let elapsedPercent = p.min((p.millis() - this.startTime) / TOTAL_TIME, 0.999999999)
    let h = this.heightTween.get(elapsedPercent, HEIGHT * 7.5) + this.h
    let w = this.a / h
    p.rect(this.x - w / 2, this.y - h, w, h)
    // draw door
    p.push()
    p.fill(25, 0, 50)
    let dh = ((h - this.h) / h) * DOOR_HEIGHT + DOOR_HEIGHT
    let dw = DOOR_AREA / dh
    p.rect(this.x - dw / 2, this.y - dh, dw, dh)
    p.pop()
    let wh = ((h - this.h) / h) * WINDOW_HEIGHT + WINDOW_HEIGHT
    let ww = WINDOW_AREA / wh
    let beginningWinOffset = (w - (ww * (this.windowsPerRow * 2 - 1))) / 2
    p.fill(60, 60, 97)
    for (let y = 0; y < this.windowRows; y++) {
      for (let x = 0; x < this.windowsPerRow; x++) {
        p.rect((this.x - w / 2) + 2 * ww * x + beginningWinOffset, this.y - h + y * (wh * 2) + wh, ww, wh)
      }
    }
    p.pop()
  }

  Building.prototype.isDead = function() {
    return p.millis() - this.startTime >= BUILDING_LIFETIME
  }

  const drawSky = () => {
    p.push()
    let h = GROUND_LEVEL
    for (let i = 0; i <= h; i++) {
      let inter = p.map(i, 0, h, 0, 1)
      let c = p.lerpColor(p.color(0, 0, 0), SKY_COLOR, inter)
      p.stroke(c)
      p.line(0, i, WIDTH, i)
    }
    p.pop()
  }

  const WIDTH = 300
  const HEIGHT = 300
  const DOOR_WIDTH = WIDTH / 50
  const DOOR_HEIGHT = HEIGHT / 25
  const DOOR_AREA = DOOR_WIDTH * DOOR_HEIGHT
  const WINDOW_WIDTH = WIDTH / 50
  const WINDOW_HEIGHT = HEIGHT / 50
  const WINDOW_AREA = WINDOW_WIDTH * WINDOW_HEIGHT
  const GROUND_LEVEL = HEIGHT - HEIGHT / 8
  let SKY_COLOR = null

  const TOTAL_TIME = 3000
  const SPAWN_RATE = 2000
  const BUILDING_LIFETIME = 30000

  let tween = null
  let startTime = null
  let buildings = []
  let spawnI = 0

  let spawnPoints =
    [ [WIDTH / 5, GROUND_LEVEL]
    , [WIDTH * 2 / 5, GROUND_LEVEL]
    , [WIDTH * 3 / 5, GROUND_LEVEL]
    , [WIDTH * 4 / 5, GROUND_LEVEL]
    ]

  p.setup = function() {
    p.createCanvas(WIDTH, HEIGHT)
    p.colorMode(p.HSB)
    p.randomSeed(5221998)
    SKY_COLOR = p.color(210, 100, 20)
    tween = new Tween(x => x * x * p.sin(1 / x), [-1 / p.TWO_PI, 0])
    startTime = p.millis()
  }

  p.draw = function() {
    p.background(20)
    drawSky()

    if (p.millis() - startTime >= SPAWN_RATE) {
      startTime = p.millis()
      let [x, y] = spawnPoints[spawnI]
      spawnI = (spawnI + 1) % spawnPoints.length
      let w = p.floor(p.random(2, 10)) * WIDTH / 32
      let h = p.floor(p.random(4, 14)) * HEIGHT / 16
      buildings.push(new Building(x, y, w, h, tween))
    }

    for (let b of buildings) {
      b.draw()
    }
    for (let i = buildings.length - 1; i >= 0; i--) {
      let building = buildings[i]
      if (building.isDead())  {
        buildings.splice(i, 1)
      }
    }
  }
}
