export const art = (WIDTH, HEIGHT) => {
  return function(p) {
    const SQUIGGLE_INTERVAL = 50
    const NUM_SQUIGGLE = 10
    let squiggleYPos = []
    let lastSquiggle = 0

    const NUM_ANT_SQUIGGLE = 10
    let antennaSquiggle = []
    let lastAntSquiggle = 0

    const genNewSquiggle = (min, max) => {
      squiggleYPos = []
      for (let i = 0; i < NUM_SQUIGGLE; i++) {
        squiggleYPos.push(p.random(min, max))
      }
    }

    const genNewAntSquiggle = (min, max) => {
      antennaSquiggle = []
      for (let i = 0; i < NUM_ANT_SQUIGGLE; i++) {
        antennaSquiggle.push(p.random(min, max))
      }
    }

    const DrawEar = (x, y, w, h) => {
      p.push()
      p.fill(0, 100, 90)
      p.rect(x - w / 2, y - h / 2, w, h, w / 10)
      p.pop()
    }

    const DrawEye = (x, y, r) => {
      p.push()
      p.fill(50)
      p.circle(x, y, r)
      p.fill(0, 100, 90)
      p.circle(x, y, r - r / 15)
      p.pop()
    }

    const DrawMouth = (x, y, w, h) => {
      p.push()
      p.fill(50)
      p.rect(x - w / 2, y - h / 2, w, h)
      const innerWidth = w - h / 5
      const innerHeight = h - h / 5
      p.fill(15)
      p.rect(x - innerWidth / 2, y - innerHeight / 2, innerWidth, innerHeight)

      // Squiggly
      const xLeftBound = x - innerWidth / 2
      const xRightBound = x + innerWidth / 2
      const yTopBound = y - innerHeight / 2
      const yBotBound = y + innerHeight / 2
      const strokeW = w / 30
      const squiggleDist = (xRightBound - xLeftBound) / 10
      p.stroke(175, 100, 100)
      p.strokeWeight(strokeW)

      if (squiggleYPos.length == 0 || (p.millis() - lastSquiggle > SQUIGGLE_INTERVAL)) {
        genNewSquiggle(yTopBound, yBotBound)
        lastSquiggle = p.millis()
      }

      p.beginShape()
      p.curveVertex(xLeftBound + strokeW / 2, y)
      p.curveVertex(xLeftBound + strokeW / 2, y)
      for (let i = 1; i < NUM_SQUIGGLE; i++) {
        p.curveVertex(xLeftBound + i * squiggleDist, squiggleYPos[i])
      }
      p.curveVertex(xRightBound - strokeW / 2, y)
      p.curveVertex(xRightBound - strokeW / 2, y)
      p.endShape()

      p.pop()
    }

    const DrawAntenna = (x, y, w, h) => {
      p.push()
      p.fill(33)
      p.rect(x - w / 4, y - h, w / 2, h)

      const squiggleDist = h / NUM_ANT_SQUIGGLE
      if (squiggleYPos.length == 0 || (p.millis() - lastAntSquiggle > SQUIGGLE_INTERVAL)) {
        genNewAntSquiggle(x - w / 2, x + w / 2)
        lastAntSquiggle = p.millis()
      }

      p.stroke(175, 100, 100)
      p.strokeWeight(w / 10)
      p.beginShape()
      p.curveVertex(x, y)
      p.curveVertex(x, y)
      for (let i = 1; i < NUM_ANT_SQUIGGLE; i++) {
        p.curveVertex(antennaSquiggle[i], y - i * squiggleDist)
      }
      p.curveVertex(x, y - h)
      p.curveVertex(x, y - h)
      p.endShape()

      p.noStroke()
      p.fill(0, 100, 90)
      p.circle(x, y - h, w * 1.5)
      p.pop()
    }

    const DrawRobot = (x, y, w, h) => {
      p.push()
      p.fill(33)
      p.rect(x - w / 2, y - h / 2, w, h, w / 10)

      // Draw Ears
      const earWidth = w / 7
      const earHeight = h / 2
      DrawEar(x - w / 2 - earWidth / 2, y, earWidth, earHeight)
      DrawEar(x + w / 2 + earWidth / 2, y, earWidth, earHeight)

      // Draw Eyes
      const eyeRadius = w / 3
      DrawEye(x - w / 4, y - y / 6, eyeRadius)
      DrawEye(x + w / 4, y - y / 6, eyeRadius)

      // Draw Mouth
      const mouthWidth = w / 10 * 7
      const mouthHeight = h / 4
      DrawMouth(x, y + h / 4, mouthWidth, mouthHeight)

      // Draw Antenna
      DrawAntenna(x, y - h / 2, w / 10, h / 3)

      p.pop()
    }

    p.setup = function() {
      p.createCanvas(WIDTH, HEIGHT)
      p.colorMode(p.HSB)
      p.noStroke()
    }

    p.draw = function() {
      p.background(77)
      DrawRobot(WIDTH / 2, HEIGHT / 12 * 7, WIDTH / 10 * 6, HEIGHT / 10 * 6)
    }
  }
}
