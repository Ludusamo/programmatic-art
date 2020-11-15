export const art = p => {
  const WIDTH = 300
  const HEIGHT = 300
  const DARK = true

  const LAMP_W = WIDTH / 5
  const LAMP_H = HEIGHT / 3 * 2
  const LAMP_X = WIDTH / 2
  const LAMP_Y = HEIGHT / 2 + LAMP_H / 2

  const FENCE_W = WIDTH
  const FENCE_H = HEIGHT / 10
  const FENCE_X = 0
  const FENCE_Y = HEIGHT * 2 / 3

  const NUM_FIREFLIES = 25
  const FIREFLY_SIZE = WIDTH / 100
  const MOVEMENT_TIMER = 1000
  const HEIGHT_DRIFT = FIREFLY_SIZE
  let fireflies = []

  p.colorMode(p.HSB)
  const SKY_COLOR = p.color(210, 100, 20)
  const GROUND_COLOR = p.color(44, 13, 24)
  const LIGHT_COLOR = p.color(61, 34, 100, 0.01)
  const FIREFLY_COLOR = p.color(79, 64, 84, 0.1)

  const applyAmbientLight = () => {
    p.push()
    p.fill(0, 0, 10, 0.6)
    p.square(0, 0, WIDTH)
    p.pop()
  }

  const drawGround = () => {
    p.push()
    p.fill(GROUND_COLOR)
    p.rect(0, HEIGHT - HEIGHT / 3, WIDTH, HEIGHT)
    p.pop()
  }

  const drawFence = (x, y, w, h) => {
    let numPoles = 14
    let gap = w / numPoles
    let poleWidth = w / 50
    p.push()
    p.fill(15)
    for (let pole = 0; pole < numPoles; pole++) {
      let poleX = x + gap / 2 + gap * pole - poleWidth / 2
      p.rect(poleX, y - h, poleWidth, h)
      p.arc(poleX + poleWidth / 2, y - h, poleWidth, h / 10, p.PI, p.TWO_PI)
    }
    p.rect(x, y - h * 2 / 3, w, poleWidth)
    p.pop()
  }

  const drawLight = (x, y, w, h) => {
    let numLayers = 10
    p.push()
    p.fill(LIGHT_COLOR)
    for (let i = 1; i <= numLayers; i++) {
      p.arc(x, y + h, w * p.sqrt(i) / 2 * (1 + 0.1 * p.abs(p.sin(p.millis() / 1000))), h * 2, p.PI, p.TWO_PI)
      p.arc(x, y + h, w * p.sqrt(i) / 2 * (1 + 0.1 * p.abs(p.sin(p.millis() / 1000))), w / 2, p.TWO_PI, p.PI)
    }
    for (let i = 1; i <= numLayers; i++) {
      p.circle(x, y, w * p.sqrt(i) / 2 * (1 + 0.1 * p.abs(p.sin(p.millis() / 1000))))
    }
    for (let i = 1; i <= numLayers; i++) {
      p.ellipse(x, y + h, w * p.sqrt(i) / 2 * (1 + 0.1 * p.abs(p.sin(p.millis() / 1000))), w / 2)
    }
    p.pop()
  }

  const drawLamp = (x, y, w, h) => {
    let baseHeight = h / 20
    let lampHeight = h / 5
    let lampWidth = w / 3 * 2
    let capWidth = lampWidth * 1.1
    let capHeight = h / 10
    let postHeight = h - lampHeight - baseHeight - capHeight
    let postWidth = w / 10
    p.push()
    p.fill(0)
    // Base
    p.rect(x - w / 2, y - baseHeight, w, baseHeight, w / 20)
    // Post
    p.rect(x - postWidth / 2, y - baseHeight - postHeight, postWidth, postHeight)
    // Lamp
    let x1 = x - lampWidth / 2
    let y1 = y - baseHeight - postHeight - lampHeight
    p.quad(x1, y1,
           x1 + lampWidth, y1,
           x1 + lampWidth * 3 / 4, y1 + lampHeight,
           x1 + lampWidth / 4, y1 + lampHeight)
    // Cap
    p.fill(0)
    p.arc(x, y1, capWidth, capHeight, p.PI, p.TWO_PI)
    // Window
    p.fill(100)
    let winWidth =  lampWidth * 5 / 6
    let winHeight =  lampHeight * 5 / 6
    let wx1 = x - winWidth / 2
    let wy1 = y1 + lampHeight / 12
    p.quad(wx1, wy1,
           wx1 + winWidth, wy1,
           wx1 + winWidth * 3 / 4, wy1 + winHeight,
           wx1 + winWidth / 4, wy1 + winHeight)

    let lightHeight = baseHeight + postHeight + lampHeight / 3 * 2
    drawLight(x, y - lightHeight, w, lightHeight)
    p.pop()
  }

  const drawSky = () => {
    p.push()
    let h = HEIGHT / 3 * 2
    for (let i = 0; i <= h; i++) {
      let inter = p.map(i, 0, h, 0, 1)
      let c = p.lerpColor(p.color(0, 0, 0), SKY_COLOR, inter)
      p.stroke(c)
      p.line(0, i, WIDTH, i)
    }
    p.pop()
  }

  const updateFirefly = (firefly) => {
    let elapsedTime = p.millis() - firefly.startTime
    if (elapsedTime > MOVEMENT_TIMER) {
      firefly.startX = firefly.x
      firefly.targetX = firefly.x + p.random(-(FIREFLY_SIZE / 2), FIREFLY_SIZE / 2)
      if (firefly.targetX < firefly.area[0]) firefly.targetX = firefly.area[0]
      if (firefly.targetX > firefly.area[0] + firefly.area[2]) firefly.targetX = firefly.area[0] + firefly.area[2]
      firefly.startTime = p.millis()
      elapsedTime = 0
    }
    firefly.x = p.lerp(firefly.startX, firefly.targetX, elapsedTime / MOVEMENT_TIMER)
    firefly.y = firefly.startY + HEIGHT_DRIFT / 2 + HEIGHT_DRIFT * p.sin(p.millis() / 1000 + firefly.timeOffset)
  }

  const drawFirefly = (firefly) => {
    let numLayers = 10
    p.push()
    p.fill(FIREFLY_COLOR)
    for (let i = 1; i <= numLayers; i++) {
      p.circle(firefly.x,
               firefly.y,
               FIREFLY_SIZE * p.sqrt(i) / 2 * (1 + 0.5 * p.abs(p.sin(p.millis() / 1000 + firefly.timeOffset))))
    }
    p.pop()
  }

  const generateFireflies = () => {
    let fireflies = []
    let spawningXStart = WIDTH / 5
    let spawningYStart = HEIGHT / 10
    let spawningWidth = WIDTH / 5 * 3
    let spawningHeight = HEIGHT / 5 * 3
    let areaWidth = spawningWidth / p.sqrt(NUM_FIREFLIES)
    let areaHeight = spawningHeight / p.sqrt(NUM_FIREFLIES)
    let numPerRow = p.floor(spawningWidth / areaWidth)
    for (let i = 0; i < NUM_FIREFLIES; i++) {
      let areaX = spawningXStart + areaWidth * (i % numPerRow)
      let areaY = spawningYStart + areaHeight * p.floor(i / numPerRow)
      let x = areaX + p.random(areaWidth)
      let y = areaY + p.random(areaHeight)
      fireflies.push({
        x: x,
        y: y,
        timeOffset: p.random(p.TWO_PI),
        area: [areaX, areaY, areaWidth, areaHeight],
        startTime: p.millis(),
        startX: x,
        targetX: x,
        startY: y})
    }
    return fireflies
  }

  p.setup = function() {
    p.createCanvas(WIDTH, HEIGHT);
    p.randomSeed(5221998)
    fireflies = generateFireflies()
  }

  p.draw = function() {
    p.background(SKY_COLOR)
    p.noStroke()

    drawSky()
    drawGround()
    drawFence(FENCE_X, FENCE_Y, FENCE_W, FENCE_H)
    drawLamp(LAMP_X, LAMP_Y, LAMP_W, LAMP_H)

    // Ambient Light
    if (DARK) applyAmbientLight()

    // Fireflies
    p.push()
    for (let ff of fireflies) {
      updateFirefly(ff)
      drawFirefly(ff)
    }
    p.pop()
  }
}
