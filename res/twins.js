export const art = p => {
  const WIDTH = 300
  const HEIGHT = 300

  const PATH_RADIUS = WIDTH / 6
  const SPAWN_RATE = 75

  const MAX_CIRCLE_SIZE = WIDTH / 3
  const MIN_CIRCLE_SIZE = WIDTH / 6
  const SHRINK_SPEED = WIDTH / 100000
  const SHRINK_ACCELERATION = SHRINK_SPEED / 1000
  const SPEED = 0.0005

  let afterimages = []
  let circles = []

  let AfterImage = function(x, y, d, color) {
    this.x = x
    this.y = y
    this.d = d
    this.lastUpdate = p.millis()
    this.shrinkSpeed = SHRINK_SPEED
    this.color = color
  }

  AfterImage.prototype.run = function() {
    this.update()
    this.draw()
  }

  AfterImage.prototype.draw = function() {
    p.push()
    p.noStroke()
    p.fill(this.color)
    p.circle(this.x, this.y, this.d)
    p.pop()
  }

  AfterImage.prototype.update = function() {
    let delta = p.millis() - this.lastUpdate
    this.d -= delta * this.shrinkSpeed
    if (this.d < 0) this.d = 0
    this.shrinkSpeed += delta * SHRINK_ACCELERATION
    this.lastUpdate = p.millis()
  }

  AfterImage.prototype.isDead = function() {
    return this.d == 0
  }

  let Circle = function(theta, d, color) {
    this.theta = theta
    this.d = d
    this.lastUpdate = p.millis()
    this.lastSpawn = p.millis()
    this.color = color
    this.phaseTime = p.TWO_PI / SPEED
    this.phase = 'TRAVEL'
    this.nextPhase = 'EXPAND'
    this.phaseStart = p.millis()
  }

  Circle.prototype.run = function() {
    this.update()
    this.draw()
  }

  Circle.prototype.x = function() {
    return PATH_RADIUS * p.cos(this.theta) + WIDTH / 2
  }

  Circle.prototype.y = function() {
    return PATH_RADIUS * p.sin(this.theta) + HEIGHT / 2
  }

  Circle.prototype.draw = function() {
    p.push()
    p.noStroke()
    p.fill(this.color)
    p.circle(this.x(), this.y(), this.d)
    p.pop()
  }

  Circle.prototype.update = function() {
    let delta = p.millis() - this.lastUpdate
    this.theta -= delta * SPEED
    if (this.theta < 0) this.theta += 360
    this.lastUpdate = p.millis()
    if (p.millis() - this.lastSpawn > SPAWN_RATE) {
      afterimages.push(new AfterImage(this.x(), this.y(), this.d, this.color))
      this.lastSpawn = p.millis()
    }

    if (this.phase == 'TRAVEL') {
      if (this.phaseDone()) this.transitionPhase('TRAVEL')
    } else if (this.phase == 'EXPAND') {
      this.d = p.lerp(MIN_CIRCLE_SIZE, MAX_CIRCLE_SIZE, this.percentToNextPhase())
      if (this.phaseDone()) this.transitionPhase('SHRINK')
    } else if (this.phase == 'SHRINK') {
      this.d = p.lerp(MAX_CIRCLE_SIZE, MIN_CIRCLE_SIZE, this.percentToNextPhase())
      if (this.phaseDone()) this.transitionPhase('EXPAND')
    }
  }

  Circle.prototype.percentToNextPhase = function() {
    return (p.millis() - this.phaseStart) / this.phaseTime
  }

  Circle.prototype.phaseDone = function() {
    return p.millis() - this.phaseStart >= this.phaseTime
  }

  Circle.prototype.transitionPhase = function(nextPhase) {
    this.phaseStart += this.phaseTime
    this.phase = this.nextPhase
    this.nextPhase = nextPhase
  }

  p.setup = function() {
    p.createCanvas(WIDTH, HEIGHT);
    circles.push(new Circle(0, MIN_CIRCLE_SIZE, p.color(240)))
    circles.push(new Circle(-p.PI, MIN_CIRCLE_SIZE, p.color(10)))
  }

  p.draw = function() {
    p.background(100);
    for (let i = afterimages.length - 1; i >= 0; i--) {
      let ai = afterimages[i]
      ai.run()
      if (ai.isDead()) afterimages.splice(i, 1)
    }
    for (let circle of circles) {
      circle.run()
    }
  }
}
