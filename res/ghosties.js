export const art = (WIDTH, HEIGHT) => {
  return function(p) {
    const NUM_CURVES = 5
    class Ghost {
      constructor(x, y, color) {
        this.x = x
        this.y = y

        this.width = WIDTH / 4
        this.height = HEIGHT / 3
        this.headRadius = this.width / 2
        this.curveHeight = HEIGHT / 50
        this.color = color


        this.eyeWidth = this.width / 4
        this.baseLeftEyePos = [this.x - this.width / 5, this.y - this.height / 6]
        this.baseRightEyePos = [this.x + this.width / 5, this.y - this.height / 6]
        this.eyeLeftPos = this.baseLeftEyePos
        this.eyeRightPos = this.baseRightEyePos
        this.eyeLeftTarget = this.baseLeftEyePos
        this.eyeRightTarget = this.baseRightEyePos
        this.lastEyePosChange = p.random(0, 5000)
        this.eyePosChangeInterval = 2000
        this.yModifierOffset = p.random(0, 5000)
      }

      strokeColor() {
        return p.color(p.hue(this.color), p.saturation(this.color) - 10, p.lightness(this.color) - 5)
      }

      render(t) {
        if (t - this.lastEyePosChange > this.eyePosChangeInterval) {
          let randX = p.random(-this.eyeWidth / 6, this.eyeWidth / 6)
          let randY = p.random(-this.eyeWidth / 6, this.eyeWidth / 6)
          this.eyeLeftTarget =
            [ this.baseLeftEyePos[0] + randX
            , this.baseLeftEyePos[1] + randY
            ]
          this.eyeRightTarget =
            [ this.baseRightEyePos[0] + randX
            , this.baseRightEyePos[1] + randY
            ]
          this.lastEyePosChange = t
        }

        let yModifier = HEIGHT / 50 * p.sin((t + this.yModifierOffset) / 1200)
        let bodyTop = this.y - (this.height / 2 - this.headRadius) + yModifier
        let curveTop = this.y + (this.height / 2 - this.curveHeight) + yModifier
        p.push()

        let startX = this.x - this.headRadius
        let endX = this.x + this.headRadius

        p.fill(this.color)
        p.strokeWeight(this.width / 20)
        p.stroke(this.strokeColor())

        p.beginShape()
        // Draw Head
        for (let a = 0; a <= p.PI; a += p.PI / 100) {
          let x = this.headRadius * p.cos(a) + this.x
          let y = bodyTop - this.headRadius * p.sin(a)
          p.curveVertex(x, y)
        }
        p.curveVertex(startX, bodyTop)

        // Draw bottom
        for (let i = 0; i <= p.TWO_PI; i += p.TWO_PI / 100) {
          let x = (this.width / p.TWO_PI) * i + startX
          let y = this.curveHeight * p.cos(t / 240 + i * NUM_CURVES) + curveTop
          p.curveVertex(x, y)
        }
        // Close out right side
        p.curveVertex(endX, bodyTop)
        p.curveVertex(endX, bodyTop)
        p.endShape()

        // Draw Eyes
        p.fill(80)
        p.noStroke()
        p.circle(this.baseLeftEyePos[0], this.baseLeftEyePos[1] + yModifier, this.eyeWidth)
        p.circle(this.baseRightEyePos[0], this.baseRightEyePos[1] + yModifier, this.eyeWidth)

        // Draw pupil
        p.fill(20)
        let elapsed = (t - this.lastEyePosChange) / (this.eyePosChangeInterval / 2)
        this.eyeLeftPos =
          [ p.lerp(this.eyeLeftPos[0], this.eyeLeftTarget[0], elapsed)
          , p.lerp(this.eyeLeftPos[1], this.eyeLeftTarget[1], elapsed)
          ]
        this.eyeRightPos =
          [ p.lerp(this.eyeRightPos[0], this.eyeRightTarget[0], elapsed)
          , p.lerp(this.eyeRightPos[1], this.eyeRightTarget[1], elapsed)
          ]
        p.circle(this.eyeLeftPos[0], this.eyeLeftPos[1] + yModifier, this.eyeWidth / 2)
        p.circle(this.eyeRightPos[0], this.eyeRightPos[1] + yModifier, this.eyeWidth / 2)

        p.pop()
      }
    }

    let ghosts = []

    p.setup = function() {
      p.createCanvas(WIDTH, HEIGHT)
      p.colorMode(p.HSB)

      ghosts =
        [ new Ghost(WIDTH / 4, HEIGHT / 4, p.color(360, 69, 80))
        , new Ghost(WIDTH / 4 * 3, HEIGHT / 4 * 3, p.color(240, 69, 80))
        , new Ghost(WIDTH / 4, HEIGHT / 4 * 3, p.color(120, 69, 40))
        , new Ghost(WIDTH / 4 * 3, HEIGHT / 4, p.color(60, 69, 50))
        ]
    }

    p.draw = function() {
      p.background(15)
      const t = p.millis()
      for (let ghost of ghosts) {
        ghost.render(t)
      }
    }
  }
}
