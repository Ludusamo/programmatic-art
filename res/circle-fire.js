let ParticleSystem = function(particleObj, origin, maxNum, lifespan, p5, spread, upwardVel, spawnRate) {
  this.particles = []
  this.particleObj = particleObj
  this.origin = origin.copy()
  this.maxNum = maxNum
  this.lifespan = lifespan
  this.spread = spread || 0.5
  this.upwardVel = upwardVel || 0.5
  this.spawnRate = spawnRate || 2
  this.p5 = p5
}

ParticleSystem.prototype.run = function() {
  for (let i = 0; i < this.spawnRate; i++) {
    this.addParticle()
  }
  for (let i = this.particles.length - 1; i >= 0; i--) {
    let particle = this.particles[i]
    particle.run()

    if (particle.isDead())  {
      this.particles.splice(i, 1)
    }
  }
}

ParticleSystem.prototype.addParticle = function() {
  if (this.particles.length >= this.maxNum) return
  let vx = this.p5.randomGaussian() * this.spread
  let vy = this.p5.randomGaussian() * this.upwardVel - this.upwardVel * 2
  this.particles.push(new Particle(this.origin, this.p5.createVector(vx, vy), this.p5.createVector(), this.lifespan, this.particleObj()))
}

let Particle = function(startingPosition, velocity, acceleration, lifespan, particleObj) {
  this.pos = startingPosition.copy()
  this.lifespan = lifespan
  this.maxLifespan = lifespan
  this.obj = particleObj
  this.vel = velocity
  this.acc = acceleration
}

Particle.prototype.run = function() {
  this.update()
  this.render()
}

Particle.prototype.render = function() {
  this.obj.render(this.pos, this.lifespan / this.maxLifespan)
}

Particle.prototype.update = function() {
  this.vel.add(this.acc)
  this.pos.add(this.vel)
  this.lifespan -= 2.5
  this.acc.mult(0)
}

Particle.prototype.isDead = function() {
  return this.lifespan <= 0
}

export const art = (WIDTH, HEIGHT) => {
  return function(p) {
    const CIRCLE_WIDTH = WIDTH / 5
    p.colorMode(p.HSB)

    let fire = []

    let fireParticle = function(color, lightStrength, size) {
      let emitLight = lightStrength || 0
      let diameter = size || CIRCLE_WIDTH
      return function () {
        return {render: function(pos, lifetime) {
            p.push()
            p.noStroke()
            color.setAlpha(lifetime)
            p.fill(color)
            p.circle(pos.x, pos.y, diameter / 2)
            color.setAlpha(emitLight)
            p.fill(color)
            p.circle(pos.x, pos.y, diameter)
            p.pop()
          }
        }
      }
    }

    p.setup = function() {
      p.createCanvas(WIDTH, HEIGHT);
      let firePos = p.createVector(WIDTH / 2 - CIRCLE_WIDTH / 6, HEIGHT / 7 * 4)
      let firePos2 = p.createVector(WIDTH / 2 + CIRCLE_WIDTH / 6, HEIGHT / 7 * 4)
      fire.push(new ParticleSystem(fireParticle(p.color(10, 100, 100), 0.01), firePos, WIDTH * 0.3, WIDTH  * 0.5, p, 0.3))
      fire.push(new ParticleSystem(fireParticle(p.color(10, 100, 100), 0.01), firePos2, WIDTH * 0.3, WIDTH  * 0.5, p, 0.3))
      fire.push(new ParticleSystem(fireParticle(p.color(30, 100, 100), 0.02), firePos, WIDTH * 0.2, WIDTH * 0.3, p, 0.2))
      fire.push(new ParticleSystem(fireParticle(p.color(30, 100, 100), 0.02), firePos2, WIDTH * 0.2, WIDTH * 0.3, p, 0.2))
      fire.push(new ParticleSystem(fireParticle(p.color(50, 100, 100), 0.01, WIDTH / 6), firePos, WIDTH * 0.1, WIDTH * 0.4, p, 0.1, 0.2, 1))
      fire.push(new ParticleSystem(fireParticle(p.color(50, 100, 100), 0.01, WIDTH / 6), firePos2, WIDTH * 0.1, WIDTH * 0.4, p, 0.1, 0.2, 1))
    }

    p.draw = function() {
      p.background(10)
      for (let ps of fire) {
        ps.run()
      }
    }
  }
}
