export const art = p => {
  const WIDTH = 300
  const HEIGHT = 300

  const NUM_CIRCLE_PER_ROW = 7
  const NUM_CIRCLE_PER_COL = 7

  const PHASE_DURATION = 1000

  const DIAMETER = WIDTH / (NUM_CIRCLE_PER_ROW - 2)
  const RADIUS = DIAMETER / 2

  const MODE_DURATION = 2000
  const NUM_MODES = 4

  const COLOR_MODE_DURATION = 2000

  p.setup = function() {
    p.createCanvas(WIDTH, HEIGHT);
  }

  p.draw = function() {
    let time = p.millis()
    let colorMode = p.floor((time + 1000) / COLOR_MODE_DURATION) % 2

    p.background(colorMode ? 50 : 200)
    p.fill(colorMode ? 200 : 50)
    p.noStroke()

    for (let y = -1; y < NUM_CIRCLE_PER_COL; y++) {
      for (let x = -1; x < NUM_CIRCLE_PER_ROW; x++) {
        let xOffset = 0
        let yOffset = 0
        let firstXPos = x * DIAMETER + RADIUS
        let secondXPos = firstXPos
        let firstYPos = y * DIAMETER + RADIUS
        let secondYPos = y * DIAMETER + RADIUS
        let arcOffset = 0

        let mode = p.floor(time / MODE_DURATION) % NUM_MODES
        let timeScale = (time % PHASE_DURATION) / PHASE_DURATION
        let standardOffset = DIAMETER * timeScale
        if (mode == 0) {
          xOffset = standardOffset * (y % 2 == 0 ? -1 : 1)
          firstXPos += xOffset
          secondXPos += xOffset
        } else if (mode == 1) {
          yOffset = standardOffset * (x % 2 == 0 ? -1 : 1)
          firstYPos += yOffset
          secondYPos += yOffset
        } else if (mode == 2) {
          firstXPos += standardOffset * (y % 2 == 0 ? -1 : 1)
          secondXPos += standardOffset * (y % 2 == 0 ? 1 : -1)
        } else if (mode == 3) {
          firstYPos += standardOffset * (x % 2 == 0 ? -1 : 1)
          secondYPos += standardOffset * (x % 2 == 0 ? 1 : -1)
          arcOffset = p.HALF_PI
        }
        p.arc(p.floor(firstXPos), p.floor(firstYPos), DIAMETER, DIAMETER, 0 + arcOffset, p.PI + arcOffset)
        p.arc(p.floor(secondXPos), p.floor(secondYPos), DIAMETER, DIAMETER, p.PI + arcOffset, p.TWO_PI + arcOffset)
      }
    }
  }
}
