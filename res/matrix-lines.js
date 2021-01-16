export const art = (WIDTH, HEIGHT) => {
  return function(p) {
    p.colorMode(p.HSB)

    let points = []

    const DATA_COLOR = p.color(143, 100, 50)

    let paths = []
    const PATH_WIDTH = WIDTH / 50
    const NUM_PATHS = 10
    const NUM_NODES = WIDTH / PATH_WIDTH
    const SPAWN_PROB_INTERVAL = 10000

    const TRAVEL_SPEED = 50
    const TRAIL_LIFETIME = 1000

    let pointAdjustment = function(i) {
      return i * PATH_WIDTH - PATH_WIDTH / 2
    }

    let Path = function(start, end) {
      this.start = start
      this.end = end
      this.lastSpawn = p.millis()
      this.spawnRoll = p.random(SPAWN_PROB_INTERVAL)
      this.data = []
    }

    Path.prototype.run = function() {
      this.update()
      this.draw()
      for (let i = this.data.length - 1; i >= 0; i--) {
        this.data[i].run()

        if (this.data[i].isDead())  {
          this.data.splice(i, 1)
        }
      }
    }

    Path.prototype.update = function() {
      let threshold = p.lerp(0, SPAWN_PROB_INTERVAL, (p.millis() - this.lastSpawn) / SPAWN_PROB_INTERVAL)
      if (this.spawnRoll < threshold) {
        this.data.push(new Data(this))
        this.lastSpawn = p.millis()
        this.spawnRoll = p.random(SPAWN_PROB_INTERVAL)
      }
    }

    Path.prototype.draw = function() {
      p.push()
      p.stroke(10)
      p.strokeWeight(PATH_WIDTH)
      if (this.start.x == -1 || this.start.x == NUM_NODES + 1) {
        p.line(pointAdjustment(this.start.x), pointAdjustment(this.start.y), pointAdjustment(this.end.x), pointAdjustment(this.start.y))
        p.line(pointAdjustment(this.end.x), pointAdjustment(this.start.y), pointAdjustment(this.end.x), pointAdjustment(this.end.y))
      } else if (this.start.y == -1 || this.start.y == NUM_NODES + 1) {
        p.line(pointAdjustment(this.start.x), pointAdjustment(this.start.y), pointAdjustment(this.start.x), pointAdjustment(this.end.y))
        p.line(pointAdjustment(this.start.x), pointAdjustment(this.end.y), pointAdjustment(this.end.x), pointAdjustment(this.end.y))
      }
      p.pop()
    }

    let Trail = function(pos) {
      this.pos = pos.copy()
      this.size = PATH_WIDTH
      this.start = p.millis()
    }

    Trail.prototype.timeAlive = function() {
      return p.millis() - this.start
    }

    Trail.prototype.run = function() {
      this.update()
      this.draw()
    }

    Trail.prototype.update = function() {
      this.size = p.lerp(PATH_WIDTH, 0, this.timeAlive() / TRAIL_LIFETIME)
    }

    Trail.prototype.draw = function() {
      p.push()
      p.fill(DATA_COLOR)
      let deadSpace = (PATH_WIDTH - this.size) / 2
      p.rect((this.pos.x - 1) * PATH_WIDTH + deadSpace, (this.pos.y - 1) * PATH_WIDTH + deadSpace, this.size, this.size)
      p.pop()
    }

    Trail.prototype.isDead = function() {
      return this.timeAlive() >= TRAIL_LIFETIME
    }

    let Data = function(path) {
      this.path = path
      this.pos = path.start.copy()
      if (this.path.start.x == -1 || this.path.start.x == NUM_NODES + 1) {
        this.travelMode = 'x'
      } else if (this.path.start.y == -1 || this.path.start.y == NUM_NODES + 1) {
        this.travelMode = 'y'
      }
      this.lastMove = p.millis()
      this.trails = []
    }

    Data.prototype.isDead = function() {
      return this.travelMode == 'none' && this.trails.length == 0
    }

    Data.prototype.run = function() {
      this.update()
      this.draw()
      for (let i = this.trails.length - 1; i >= 0; i--) {
        let trail = this.trails[i]
        trail.run()

        if (trail.isDead())  {
          this.trails.splice(i, 1)
        }
      }
    }

    Data.prototype.update = function() {
      if (p.millis() - this.lastMove < TRAVEL_SPEED) return
      if (this.pos.x == this.path.end.x && this.pos.y == this.path.end.y) {
        this.travelMode = 'none'
        return
      }
      else if (this.pos.x == this.path.end.x) this.travelMode = 'y'
      else if (this.pos.y == this.path.end.y) this.travelMode = 'x'
      let dir = p.createVector(0, 0)
      if (this.travelMode == 'x') {
        dir = p.createVector(this.path.end.x - this.pos.x, 0)
      } else if (this.travelMode == 'y') {
        dir = p.createVector(0, this.path.end.y - this.pos.y)
      }
      this.trails.push(new Trail(this.pos))
      this.pos.add(dir.normalize())
      this.lastMove = p.millis()
    }

    Data.prototype.draw = function() {
      p.push()
      p.fill(DATA_COLOR)
      p.rect(this.pos.x * PATH_WIDTH - PATH_WIDTH, this.pos.y * PATH_WIDTH - PATH_WIDTH, PATH_WIDTH, PATH_WIDTH)
      p.pop()
    }

    let populatePoints = function() {
      let points = []
      for (let i = 0; i < NUM_NODES; i++) {
        points.push(p.createVector(i, 0 - 1))
        points.push(p.createVector(i, NUM_NODES + 1))
        points.push(p.createVector(0 - 1, i))
        points.push(p.createVector(NUM_NODES + 1, i))
      }
      return points
    }

    let getRandomPoint = function() {
      return points[p.floor(p.random(0, points.length))]
    }

    p.setup = function() {
      p.randomSeed(34)
      p.createCanvas(WIDTH, HEIGHT);
      p.noStroke()
      points = populatePoints()
      for (let i = 0; i < NUM_PATHS; i++) {
        let start = getRandomPoint()
        let end = null
        do {
          end = getRandomPoint()
        } while(start.x == end.x || start.y == end.y)
        paths.push(new Path(start, end))
      }
    }

    p.draw = function() {
      p.background(0)

      for (let path of paths) {
        path.run()
      }
    }
  }
}
