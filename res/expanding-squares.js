export const art = p => {
  const WIDTH = 300
  const HEIGHT = 300

  const COLS = 15
  const ROWS = 15
  const INIT_SQ_WIDTH = WIDTH / COLS
  const MAX_SQ_WIDTH = INIT_SQ_WIDTH * 2
  const TIME_SCALE = 5000
  const COLOR1 = p.color(0, 254, 255)
  const COLOR2 = p.color(225, 0, 255)

  const distanceFromCenter = function(x, y) {
    const xDiff = x - p.floor(((COLS + 2) / 2))
    const yDiff = y - p.floor(((ROWS + 2) / 2))
    return p.sqrt(xDiff * xDiff + yDiff * yDiff)
  }
  const calculateWidth = function(x, y, time) {
    const dist = distanceFromCenter(x, y)
    const scaledTime = (time - dist * dist * 100) % TIME_SCALE
    let lerpScale = 0
    if (scaledTime < 250) lerpScale = 0
    else if (scaledTime < 2500) {
      lerpScale = (scaledTime - 250) / 2250
    } else if (scaledTime < 2750) lerpScale = 1
    else {
      lerpScale = 1 - ((scaledTime - 2750) / 2250)
    }
    return p.lerp(INIT_SQ_WIDTH, MAX_SQ_WIDTH, lerpScale)
  }

  p.setup = function() {
    p.createCanvas(WIDTH, HEIGHT);
  }

  p.draw = function() {
    p.clear()
    p.noFill()
    p.colorMode(p.RGB)
    const curTime = p.millis()

    for (let y = 0; y < ROWS + 2; y++) {
      for (let x = 0; x < COLS + 2; x++) {
        if ((y % 2 == 1 && x % 2 == 0) || (y % 2 == 0 && x % 2 == 1)) continue
        const sqWidth = calculateWidth(x, y, curTime)
        const sqX = (x * INIT_SQ_WIDTH - (sqWidth - INIT_SQ_WIDTH) / 2) - INIT_SQ_WIDTH
        const sqY = (y * INIT_SQ_WIDTH - (sqWidth - INIT_SQ_WIDTH) / 2) - INIT_SQ_WIDTH
        p.stroke(p.lerpColor(COLOR1, COLOR2, (sqWidth - INIT_SQ_WIDTH) / (MAX_SQ_WIDTH - INIT_SQ_WIDTH)))
        p.strokeWeight(3 * ((sqWidth - INIT_SQ_WIDTH) / (MAX_SQ_WIDTH - INIT_SQ_WIDTH)))
        p.rect(sqX, sqY, sqWidth)
      }
    }
  }
}
