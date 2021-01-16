let ParticleSystem = function(p, spawners, Particle, maxPoolSize=1000) {
  this.p = p
  this.particles = []
  this.spawners = spawners
  this.Particle = Particle

  this.maxPoolSize = maxPoolSize
}

ParticleSystem.prototype.spawn = function(spawner) {
  let dead = this.particles.find(p => p.isDead())
  if (dead !== undefined) {
    spawner.spawn(dead)
  } else if (this.particles.length < this.maxPoolSize) {
    let p = new this.Particle(this.p)
    spawner.spawn(p)
    this.particles.push(p)
  }
}

ParticleSystem.prototype.run = function() {
  this.update()
  this.render()
}

ParticleSystem.prototype.update = function() {
  this.spawners
    .filter(s => s.readyToSpawn())
    .forEach(s => this.spawn(s))
  for (let p of this.particles) {
    p.update()
  }
}

ParticleSystem.prototype.render = function() {
  this.p.push()
  for (let p of this.particles) {
    p.render()
  }
  this.p.pop()
}

let CircleGenerator = WIDTH => {
  let Circle = function(p) {
    this.p = p
    this.pos = this.p.createVector(0, 0)
    this.vel = this.p.createVector(0, 0)
    this.maxSize = WIDTH / 15
    this.start = this.p.millis()
    this.lastUpdate = this.p.millis()
    this.maxLifetime = 5000
  }

  Circle.prototype.update = function() {
    let t = this.p.millis() - this.lastUpdate
    this.pos.add(p5.Vector.mult(this.vel, t))
    this.lastUpdate = this.p.millis()
  }

  Circle.prototype.render = function() {
    if (this.isDead()) return
    this.p.push()
    this.p.fill(0, 0, 90)
    this.p.circle(this.pos.x, this.pos.y, this.size())
    this.p.pop()
  }

  Circle.prototype.isDead = function() {
    return this.p.millis() - this.start >= this.maxLifetime
  }

  Circle.prototype.size = function() {
    let aliveTime = this.p.millis() - this.start
    let halfLife = this.maxLifetime / 2
    if (aliveTime > this.maxLifetime / 2) {
      return this.p.lerp(this.maxSize, 0, (aliveTime - halfLife) / halfLife)
    }
    return this.p.lerp(0, this.maxSize, aliveTime / halfLife)
  }
  return Circle
}

let DirectionalSpawner = function(p, x, y, direction, startTime, vel=1, spawnInterval=1000) {
  this.p = p
  this.x = x
  this.y = y
  this.vel = vel
  this.direction = direction
  this.spawnInterval = spawnInterval
  this.lastSpawn = startTime || this.p.millis()
}

DirectionalSpawner.prototype.spawn = function(particle) {
  particle.pos.x = this.x
  particle.pos.y = this.y
  particle.vel = this.direction
  particle.vel.setMag(this.vel)
  particle.start = this.p.millis()
  this.lastSpawn = this.p.millis()
}

DirectionalSpawner.prototype.readyToSpawn = function() {
  return this.p.millis() - this.lastSpawn >= this.spawnInterval
}

let particleSystem = null


export const art = (WIDTH, HEIGHT) => {
  const R = WIDTH / 10
  const V = WIDTH * 0.00005
  const SPAWN_INTERVAL = 1600

  const NUM_SPAWNERS = 18
  return function(p) {
    let spawnDirection = function(pos, center=p.createVector(WIDTH / 2, HEIGHT / 2)) {
      let dir = p5.Vector.sub(pos, center)
      dir.normalize()
      return dir
    }
    p.setup = function() {
      p.createCanvas(WIDTH, HEIGHT)
      p.noStroke()
      p.colorMode(p.HSB)
      let startTime = p.millis()
      let center = p.createVector(WIDTH / 2, HEIGHT / 2)
      let spawners = []
      for (let angle = 0; angle < p.TWO_PI; angle += p.TWO_PI / NUM_SPAWNERS) {
        let i = angle / (p.TWO_PI / NUM_SPAWNERS)
        let pos = p.createVector(R * p.sin(angle) + center.x, R * p.cos(angle) + center.y)
        spawners.push(new DirectionalSpawner(p, pos.x, pos.y, spawnDirection(pos), startTime - i * (SPAWN_INTERVAL / NUM_SPAWNERS), V, SPAWN_INTERVAL))
      }
      particleSystem = new ParticleSystem(p, spawners, CircleGenerator(WIDTH))
    }

    p.draw = function() {
      p.background(20)
      particleSystem.run()
    }
  }
}
