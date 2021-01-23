export const art = (WIDTH, HEIGHT) => {
  return function(p) {
    class Loading {
      constructor(x, y, w, h, mainColor) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.mainColor = mainColor
        this.backgroundColor = p.color(85)
      }

      render() {
        p.push()
        p.noStroke()
        p.fill(this.backgroundColor)
        p.rect(this.x, this.y, this.w, this.h, this.w / 20)
        p.pop()
      }
    }

    class PulsingBars extends Loading {
      constructor(x, y, w, h, mainColor, numBars=5) {
        super(x, y, w, h, mainColor)
        this.numBars = numBars
      }

      render() {
        super.render()
        p.push()
        const numColumns = this.numBars * 2 + 1 + this.numBars
        const barWidth = this.w / numColumns
        p.noStroke()
        p.fill(mainColor)
        for (let i = 0; i < this.numBars; i++) {
          const barHeight = this.h / 2 * p.lerp(0.2, 1, p.abs(p.sin(-p.PI / this.numBars * i + p.millis() / 750)))
          p.rect(((numColumns - (this.numBars * 2 - 1)) / 2 + i * 2) * barWidth + this.x,
               (this.h - barHeight) / 2 + this.y,
               barWidth,
               barHeight,
               barWidth / 3)
        }
        p.pop()
      }
    }

    class PulsingCircle extends Loading {
      constructor(x, y, w, h, mainColor) {
        super(x, y, w, h, mainColor)
        this.circleSize = w / 2
        this.startTime = p.millis()
      }

      render() {
        p.push()
        super.render()
        p.noStroke()
        p.fill(this.mainColor)
        const x = this.x + this.w / 2
        const y = this.y + this.h / 2
        p.circle(x, y, this.circleSize)
        p.noFill()
        const timeScale = p.lerp(0, 1, (p.millis() - this.startTime) / 1500)
        if (timeScale > 1.1) {
          this.startTime = p.millis()
        }
        const r = this.circleSize * 1.5 * timeScale
        p.strokeWeight(this.circleSize / 5 * timeScale)
        p.stroke(this.backgroundColor)
        p.arc(x, y, r, r, 0, p.TWO_PI)
        p.pop()
      }
    }

    class RotatoPotato extends Loading {
      constructor(x, y, w, h, mainColor) {
        super(x, y, w, h, mainColor)
        this.circleSize = w / 10
        this.arcRadius = w / 4
        this.secondaryColor = p.color(p.hue(mainColor), p.saturation(mainColor) - 80, p.brightness(mainColor) + 40)
      }

      getCirclePos(angle) {
        return p.createVector(this.arcRadius * p.cos(angle), this.arcRadius * p.sin(angle))
      }

      getRotation() {
        if (p.floor(p.millis() / 750) % 2) {
          return p.lerp(0, p.PI, p.millis() % 750 / 750)
        }
        return 0
      }

      render() {
        super.render()
        p.push()
        p.noStroke()
        p.fill(this.mainColor)
        const center = p.createVector(this.x + this.w / 2, this.y + this.h / 2)
        p.circle(center.x, center.y, this.circleSize)
        p.fill(this.secondaryColor)
        const rotation = this.getRotation()
        const pos1 = this.getCirclePos(rotation)
        p.circle(center.x + pos1.x, center.y + pos1.y, this.circleSize)
        const pos2 = this.getCirclePos(p.PI + rotation)
        p.circle(center.x + pos2.x, center.y + pos2.y, this.circleSize)
        p.pop()
      }
    }

    class FallingBars extends Loading {
      constructor(x, y, w, h, mainColor, numBars=4) {
        super(x, y, w, h, mainColor)
        this.numBars = numBars
      }

      render() {
        super.render()
        p.push()
        const numColumns = this.numBars * 2 + 1 + this.numBars * 4
        const barWidth = this.w / numColumns
        const barHeight = this.h / 4
        p.noStroke()
        p.fill(mainColor)
        for (let i = 0; i < this.numBars; i++) {
          const yOffset = (this.h / 2 - barHeight / 2) * p.lerp(1, 0, p.abs(p.sin(-p.QUARTER_PI / this.numBars * i + p.millis() / 1500)))
          p.rect(((numColumns - (this.numBars * 2 - 1)) / 2 + i * 2) * barWidth + this.x,
               (this.h - barHeight) / 4 + this.y + yOffset,
               barWidth,
               barHeight,
               barWidth / 3)
        }
        p.pop()
      }
    }

    let loadingAnims = []
    let mainColor = null

    p.setup = function() {
      p.createCanvas(WIDTH, HEIGHT);
      p.colorMode(p.HSB)

      mainColor = p.color(190, 98, 23)
      const x1 = WIDTH / 51
      const x2 = WIDTH / 2 + WIDTH / 102
      const y1 = HEIGHT / 51
      const y2 = HEIGHT / 2 + HEIGHT / 102
      const w = WIDTH / 51 * 24
      const h = HEIGHT / 51 * 24
      loadingAnims.push(new PulsingBars(x1, y1, w, h, mainColor))
      loadingAnims.push(new PulsingCircle(x2, y1, w, h, mainColor))
      loadingAnims.push(new RotatoPotato(x1, y2, w, h, mainColor))
      loadingAnims.push(new FallingBars(x2, y2, w, h, mainColor))
    }

    p.draw = function() {
      p.background(15);
      for (let anim of loadingAnims) {
        anim.render()
      }
    }
  }
}
