export const art = p => {
  p.colorMode(p.HSB)
  const WIDTH = 300
  const HEIGHT = 300

  const SQUARE_SIZE = WIDTH / 2
  const NUM_SQUARES = 10
  const LAYERS = 30
  const COLOR1 = p.color(287, 90, 51)
  const COLOR2 = p.color(327, 65, 81)
  const COLOR3 = p.color(354, 61, 93)
  const BACKGROUND_COLOR = p.color(33, 59, 93)

  const DIST_BETWEEN_LAYERS = WIDTH / 2
  const ROT_TIME_SCALE = 6000
  const TIME_SCALE = 4000
  const COLOR_TIME_SCALE = 5000
  const MAX_X = DIST_BETWEEN_LAYERS * (LAYERS - 1)

  const threeColorLerp = (c1, c2, c3, interval) => {
    if (interval < 0.5) {
      return p.lerpColor(c1, c2, interval * 2)
    }
    return p.lerpColor(c2, c3, (interval - 0.5) * 2)
  }

  const drawLayer = (layer, fixed=false) => {
    let loopPercentage = p.millis() % TIME_SCALE / TIME_SCALE
    let timeOffset = fixed ? 0 : p.floor(p.lerp(0, DIST_BETWEEN_LAYERS, loopPercentage))
    let xPos = DIST_BETWEEN_LAYERS * (layer - 2) + timeOffset
    let xPercent = xPos / MAX_X
    let layerAngleOffset = xPercent * (p.PI - p.QUARTER_PI)

    // Oscillate between 0 and 1
    let colorTimeOffset = p.millis() % COLOR_TIME_SCALE / COLOR_TIME_SCALE
    if (p.millis() % (COLOR_TIME_SCALE * 2) / (COLOR_TIME_SCALE * 2) > 0.5) {
      colorTimeOffset = 1 - colorTimeOffset
    }
    let color = threeColorLerp(COLOR1, COLOR2, COLOR3, colorTimeOffset)
    p.fill(color)
    for (let i = 0; i < NUM_SQUARES; i++) {
      p.push()
      p.noStroke()
      let angleOffset = p.millis() / 1000 * p.QUARTER_PI
      p.rotate(p.TWO_PI / NUM_SQUARES * i + angleOffset + layerAngleOffset, p.createVector(1, 0, 0))
      p.translate(xPos, 0, SQUARE_SIZE * 2 * (p.abs(p.cos(p.PI * xPercent / 2 + p.millis() / ROT_TIME_SCALE)) + 1))
      p.square(0, 0, SQUARE_SIZE)
      p.pop()
    }
  }

  p.setup = function() {
    p.createCanvas(WIDTH, HEIGHT, p.WEBGL);
  }

  p.draw = function() {
    p.background(BACKGROUND_COLOR)
    p.rotateY(p.QUARTER_PI * 2.25)
    for (let layer = 0; layer < LAYERS; layer++) {
      drawLayer(layer)
    }
  }
}
