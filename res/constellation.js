export const art = p => {
  const WIDTH = 300
  const HEIGHT = 300
  const MIN_SIZE = WIDTH / 200
  const MAX_SIZE = WIDTH / 200 * 5
  const GROWTH_TIME = 10000
  const SHRINK_TIME = 10000
  const MIN_VEL = WIDTH / 20000
  const MAX_VEL = WIDTH / 10000
  const TIME_ALIVE = 20000

  const MAX_NODES = 1000
  const SPAWN_INTERVAL = 200
  const SPAWN_BORDER = WIDTH / 10
  let lastSpawn = 0

  const MAX_LINE_LEN = WIDTH / 8
  const MIN_LINE_LEN = WIDTH / 32
  const STROKE_WEIGHT = WIDTH / 500

  p.colorMode(p.HSB)
  const NODE_COLOR = p.color(332, 36, 47)
  const STROKE_COLOR = p.color(332, 36, 47, 0.3)
  const BACKGROUND_COLOR = p.color(264, 43, 14)

  let nodes = []

  let Node = function(x, y) {
    this.pos = p.createVector(x, y)
    this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1)).setMag(p.random(MIN_VEL, MAX_VEL))
    this.size = 1.1
    this.maxSize = p.random(MIN_SIZE, MAX_SIZE)
    this.birth = p.millis()
  }

  Node.prototype.run = function() {
    this.update()
    this.draw()
  }

  Node.prototype.isDead = function() {
    return this.size < 1
  }

  Node.prototype.maxDist = function() {
    return p.lerp(MIN_LINE_LEN, MAX_LINE_LEN, this.size / MAX_SIZE)
  }

  Node.prototype.update = function() {
    if (p.millis() - this.birth < GROWTH_TIME) {
      this.size = p.lerp(this.size, this.maxSize, (p.millis() - this.birth) / GROWTH_TIME)
    }
    this.size = p.lerp(this.size, 0, p.max(p.millis() - this.birth - TIME_ALIVE, 0) / SHRINK_TIME)
    this.pos.add(this.vel)
  }

  Node.prototype.draw = function() {
    p.push()
    p.noStroke()
    p.fill(NODE_COLOR)
    p.circle(this.pos.x, this.pos.y, this.size)

    let maxDist = this.maxDist()
    p.stroke(STROKE_COLOR)
    p.strokeWeight(STROKE_WEIGHT)
    for (let node of nodes) {
      if (this.pos.dist(node.pos) <= (maxDist + node.maxDist()) / 2) {
        p.line(this.pos.x, this.pos.y, node.pos.x, node.pos.y)
      }
    }
    p.pop()
  }

  let spawn = function() {
    let x = p.random(SPAWN_BORDER, WIDTH - SPAWN_BORDER)
    let y = p.random(SPAWN_BORDER, HEIGHT - SPAWN_BORDER)
    let node = new Node(x, y)
    nodes.push(node)
  }

  p.setup = function() {
    p.randomSeed(17)
    p.createCanvas(WIDTH, HEIGHT)
    lastSpawn = p.millis()
  }

  p.draw = function() {
    p.background(BACKGROUND_COLOR)
    if (p.millis() - lastSpawn >= SPAWN_INTERVAL) {
      if (nodes.length < MAX_NODES) spawn()
      lastSpawn = p.millis()
    }
    for (let i = nodes.length - 1; i >= 0; i--) {
      let node = nodes[i]
      node.run()
      if (node.isDead())  {
        nodes.splice(i, 1)
      }
    }
  }
}
