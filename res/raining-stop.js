const TIME_SCALE = 250

const createStation = (p, w, h, roofThickness) => {
  const WIDTH = w
  const HEIGHT = h
  const ROOF_THICKNESS = roofThickness
  const COL_WIDTH = WIDTH / 15
  const SEAT_HEIGHT = HEIGHT / 5
  const BACK_HEIGHT = HEIGHT / 5 * 4

  const draw = (x, y) => {
    const leftBound = x - WIDTH / 2
    const rightBound = x + WIDTH / 2
    const innerColStart = leftBound + COL_WIDTH * 2
    const innerColWidth = WIDTH - COL_WIDTH * 4

    p.noStroke()

    // Draw Roof
    p.fill(200)
    p.rect(leftBound, y - HEIGHT, WIDTH, ROOF_THICKNESS)

    // Draw Back
    p.fill(175)
    const numPanels = 2
    const panelGap = innerColWidth / 50
    const panelWidth = innerColWidth / numPanels - (panelGap * (numPanels + 1) / numPanels)
    for (let i = 0; i < numPanels; i++) {
      p.rect((i + 1) * panelGap + innerColStart + (i * panelWidth), y - BACK_HEIGHT, panelWidth, BACK_HEIGHT)
    }

    // Draw Columns
    p.fill(200)
    p.rect(leftBound + COL_WIDTH, y - HEIGHT + ROOF_THICKNESS, COL_WIDTH, HEIGHT - ROOF_THICKNESS)
    p.rect(rightBound - 2 * COL_WIDTH, y - HEIGHT + ROOF_THICKNESS, COL_WIDTH, HEIGHT - ROOF_THICKNESS)
    p.fill(150)
    p.rect(leftBound + COL_WIDTH, y - HEIGHT + ROOF_THICKNESS, COL_WIDTH, HEIGHT / 15)
    p.rect(rightBound - 2 * COL_WIDTH, y - HEIGHT + ROOF_THICKNESS, COL_WIDTH, HEIGHT / 15)

    // Draw Seats
    p.fill(50)
    p.rect(innerColStart, y - SEAT_HEIGHT, innerColWidth, SEAT_HEIGHT / 5)
  }

  return {
    draw: draw
  }
}

const drawCloud = (p, x, y, w) => {
  const WIDTH = w
  p.fill(100)
  p.circle(x - WIDTH / 5, y + WIDTH / 30, WIDTH / 3)
  p.circle(x, y, WIDTH / 2)
  p.circle(x + WIDTH / 5, y + WIDTH / 30, WIDTH / 3)
}

const createRainDrop = (p, startX, startY, w, h, heightScale) => {
  const WIDTH = w
  const MAX_LENGTH = h

  let state = 'FALLING'
  let stateStartTime = p.millis()
  let lastTime = p.millis()
  let x = startX
  let y = startY
  let velocity = MAX_LENGTH * 2

  const drawSplash = () => {
    const timeSinceStart = p.millis() - stateStartTime
    // Splash Effect
    p.fill(75)
    p.noStroke()
    const height = MAX_LENGTH - MAX_LENGTH * (timeSinceStart / TIME_SCALE)
    p.rect(x - WIDTH / 2, y - height, WIDTH, height)

    p.noFill()
    p.stroke(75)
    p.strokeWeight(WIDTH)
    const offset = p.PI * (timeSinceStart / TIME_SCALE)
    p.arc(x + MAX_LENGTH / 2, y, MAX_LENGTH / 2, MAX_LENGTH / 2, p.PI + offset, p.PI + (p.QUARTER_PI / 2) + offset)
    p.arc(x - MAX_LENGTH / 2, y, MAX_LENGTH / 2, MAX_LENGTH / 2, p.TWO_PI - (p.QUARTER_PI / 2) - offset, p.TWO_PI - offset)
  }

  const setState = s => {
    stateStartTime = p.millis()
    state = s
  }

  const draw = () => {
    p.fill(75)
    p.noStroke()
    if (state == 'FALLING') {
      let height = p.constrain((p.millis() - stateStartTime) / 60 * heightScale, 0, MAX_LENGTH)
      p.rect(x - WIDTH / 2, y - MAX_LENGTH, WIDTH, height)
      y += velocity * (p.millis() - lastTime) / TIME_SCALE
    } else if (state == 'SPLASHING') {
      drawSplash()
      if (p.millis() - stateStartTime > TIME_SCALE * 4 / 5) {
        setState('DEAD')
      }
    }
    lastTime = p.millis()
  }

  const getState = () => state
  const getX = () => x
  const getY = () => y
  const setX = newX => x = newX
  const setY = newY => y = newY

  return {
    getX: getX,
    getY: getY,
    setX: setX,
    setY: setY,
    draw: draw,
    getState: getState,
    setState: setState
  }
}

const drawSign = (p, x, y, w, h) => {
  const POST_WIDTH = w / 10
  const BUS_X = x - w / 2 + w / 5
  const BUS_Y = y - h + w / 5
  const BUS_WIDTH = w / 10 * 6

  // Draw Post
  p.fill(175)
  p.rect(x - POST_WIDTH / 2, y - h, POST_WIDTH, h)
  p.fill(200)
  p.rect(x - w / 2, y - h, w, w)
  p.fill(125)
  p.rect(x - w + w / 10 * 6, y - h + w / 10, w / 10 * 8, w / 10 * 8)

  // Draw Bus Sign
  p.fill('yellow')
  p.rect(BUS_X, BUS_Y, BUS_WIDTH, BUS_WIDTH, BUS_WIDTH / 5, BUS_WIDTH / 5, BUS_WIDTH / 10, BUS_WIDTH / 10)
  p.rect(BUS_X, BUS_Y, BUS_WIDTH, BUS_WIDTH, BUS_WIDTH / 5, BUS_WIDTH / 5, BUS_WIDTH / 10, BUS_WIDTH / 10)
  p.fill(125)
  // Top Sign
  p.rect(BUS_X + BUS_WIDTH / 8, BUS_Y + BUS_WIDTH / 10, BUS_WIDTH / 4 * 3, BUS_WIDTH / 10)
  // Window
  p.rect(BUS_X + BUS_WIDTH / 8, BUS_Y + BUS_WIDTH / 4, BUS_WIDTH / 4 * 3, BUS_WIDTH / 3)
  // Wheel Cutout
  const cutoutY = BUS_Y + BUS_WIDTH / 8 * 7
  p.rect(BUS_X + BUS_WIDTH / 8, cutoutY, BUS_WIDTH / 4 * 3, BUS_WIDTH / 8 * 2)
  // Headlights
  p.rect(BUS_X + BUS_WIDTH / 10, BUS_Y + BUS_WIDTH / 16 * 11, BUS_WIDTH / 5, BUS_WIDTH / 10)
  p.rect(BUS_X + BUS_WIDTH * 7 / 10, BUS_Y + BUS_WIDTH / 16 * 11, BUS_WIDTH / 5, BUS_WIDTH / 10)
}

const drawUmbrella = (p, x, y, w) => {
  const NUM_POINTS = 10
  const CENTER_X = x + w / 5
  const CENTER_Y = y - w / 7
  let points = []
  for (let i = 0; i < NUM_POINTS; i++) {
    let px = x + w * p.cos(p.TWO_PI * i / NUM_POINTS)
    let py = y + w * p.sin(p.TWO_PI * i / NUM_POINTS)
    points.push([px, py])
  }

  p.strokeWeight(w / 10)
  p.stroke('brown')
  p.noFill()
  p.line(CENTER_X, CENTER_Y, x - w * 1.5, y + w)
  p.noStroke()

  for (let i = 0; i < NUM_POINTS; i++) {
    if (i % 2 == 0) {
      p.fill('red')
    } else {
      p.fill(225)
    }

    let p1 = points[i]
    let p2 = points[(i + 1) % NUM_POINTS]
    p.triangle(CENTER_X, CENTER_Y, p1[0], p1[1], p2[0], p2[1])
  }
}

export const art = (WIDTH, HEIGHT) => {
  return function(p) {
    p.randomSeed(17)

    const GROUNDX = WIDTH / 10
    const GROUNDY = HEIGHT - HEIGHT / 6
    const CLOUDY = HEIGHT / 5
    const NUM_CLOUDS = 4
    const RAIN_INTERVAL = 50

    let last_rain = p.millis()

    let station = createStation(p, WIDTH / 2, HEIGHT / 3, WIDTH / 30)
    let raindrops = []

    p.setup = () => {
      p.createCanvas(WIDTH, HEIGHT);
    }

    p.draw = () => {
      p.background(235)
      p.noStroke()
      if (p.millis() - last_rain > RAIN_INTERVAL) {
        raindrops.push(createRainDrop(p, p.random(GROUNDX, GROUNDX * 9), CLOUDY, WIDTH / 150, HEIGHT / 15, HEIGHT / 300))
        last_rain = p.millis()
      }

      for (let raindrop of raindrops) {
        raindrop.draw()
        if (raindrop.getState() == 'FALLING') {
          // Bounds for ground detection
          if (((raindrop.getX() > GROUNDX && raindrop.getX() < WIDTH / 4)
                || (raindrop.getX() > WIDTH / 4 * 3 && raindrop.getX() < GROUNDX * 9))
              && raindrop.getY() >= GROUNDY) {
            raindrop.setY(GROUNDY)
            raindrop.setState('SPLASHING')
          }
          // Bounds for roof detection
          if (raindrop.getX() > WIDTH / 4 && raindrop.getX() < WIDTH * 3 / 4 && raindrop.getY() >= GROUNDY - HEIGHT / 3) {
            raindrop.setY(GROUNDY - HEIGHT / 3)
            raindrop.setState('SPLASHING')
          }
        }
      }
      raindrops = raindrops.filter(r => r.getState() != 'DEAD')

      station.draw(WIDTH / 2, GROUNDY)

      for (let i = 0; i < NUM_CLOUDS; i++) {
        drawCloud(p, (i + 1) * WIDTH / (NUM_CLOUDS + 1), CLOUDY, WIDTH / 3)
      }

      drawSign(p, GROUNDX * 8, GROUNDY, WIDTH / 10, HEIGHT / 4)
      drawUmbrella(p, GROUNDX * 3, GROUNDY - HEIGHT / 20, HEIGHT / 20)

      // Draw Ground
      p.fill(100)
      p.rect(WIDTH / 10, GROUNDY, WIDTH / 10 * 8, HEIGHT / 100)
    }
  }
}
