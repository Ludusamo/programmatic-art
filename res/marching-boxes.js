export const art = p => {
  let ExpandingBox = function(x, y, size, c1, c2, direction=0) {
    this.x = x
    this.y = y
    this.size = size
    this.c1 = c1
    this.c2 = c2
    this.direction = direction
  }

  ExpandingBox.prototype.render = function(boxOffset, offset, yOffset) {
    p.push()
    if (this.direction) {
      p.fill(this.c1)
      p.triangle(this.x + boxOffset,
               this.y + yOffset,
               this.x + this.size + boxOffset,
               this.y + this.size + yOffset,
               this.x + boxOffset,
               this.y + this.size + yOffset)
      p.fill(this.c2)
      p.triangle(this.x + offset + boxOffset,
               this.y + yOffset,
               this.x + this.size + offset + boxOffset,
               this.y + yOffset,
               this.x + this.size + offset + boxOffset,
               this.y + this.size + yOffset)
    } else {
      p.fill(this.c2)
      p.triangle(this.x - offset - boxOffset,
               this.y + yOffset,
               this.x + this.size - offset - boxOffset,
               this.y + yOffset,
               this.x - offset - boxOffset,
               this.y + this.size + yOffset)
      p.fill(this.c1)
      p.triangle(this.x + this.size - boxOffset,
               this.y + yOffset,
               this.x + this.size - boxOffset,
               this.y + this.size + yOffset,
               this.x - boxOffset,
               this.y + this.size + yOffset)
    }
    p.pop()
  }

  ExpandingBox.prototype.totalSize = function() {
    return this.size * 2
  }

  ExpandingBox.prototype.elapsed = function() {
    return p.millis() - this.startTime
  }

  p.colorMode(p.HSB)

  const WIDTH = 1000
  const HEIGHT = 1000

  const SQUARE_SIZE = WIDTH / 8
  let TRIANGLE_COLOR_1 = p.color(40)
  let TRIANGLE_COLOR_2 = p.color(80)
  let boxes = []

  const EXPAND_TIME_SCALE = 4000
  const EXPAND_HALF_TIME = EXPAND_TIME_SCALE / 2
  const QUARTER_TIME = EXPAND_HALF_TIME / 2
  let startTime = 0
  let globalHalfOffset = 0
  let globalBoxOffset = 0
  let globalYOffset = 0

  p.setup = function() {
    p.createCanvas(WIDTH, HEIGHT)
    p.noStroke()
    for (let y = -4; y < HEIGHT / SQUARE_SIZE; y++) {
      for (let x = -2; x < WIDTH / SQUARE_SIZE + 2; x++) {
        boxes.push(new ExpandingBox(x * SQUARE_SIZE * 2 + (y % 2 * SQUARE_SIZE),
                                    y * SQUARE_SIZE,
                                    SQUARE_SIZE,
                                    TRIANGLE_COLOR_1,
                                    TRIANGLE_COLOR_2,
                                    y % 2))
      }
    }
    startTime = p.millis()
  }

  p.draw = function() {
    p.background(20)
    let elapsed = p.millis() - startTime

    if (elapsed % EXPAND_TIME_SCALE / EXPAND_HALF_TIME < 1) {
      globalHalfOffset = p.lerp(globalHalfOffset, SQUARE_SIZE, (elapsed % EXPAND_TIME_SCALE) / EXPAND_HALF_TIME)
      globalBoxOffset = p.lerp(globalBoxOffset,
                             2 * SQUARE_SIZE * p.ceil(elapsed / EXPAND_HALF_TIME),
                             (elapsed % EXPAND_TIME_SCALE) / EXPAND_HALF_TIME)
    } else {
      globalHalfOffset = p.lerp(globalHalfOffset, 0, (elapsed % EXPAND_TIME_SCALE - EXPAND_HALF_TIME) / EXPAND_HALF_TIME)
      globalBoxOffset = p.lerp(globalBoxOffset,
                             2 * SQUARE_SIZE * p.ceil(elapsed / EXPAND_HALF_TIME),
                             (elapsed % EXPAND_TIME_SCALE - EXPAND_HALF_TIME) / EXPAND_HALF_TIME)
    }
    globalYOffset = p.lerp(globalYOffset,
                         SQUARE_SIZE * p.ceil(elapsed / QUARTER_TIME),
                         (elapsed % QUARTER_TIME) / QUARTER_TIME)
    if (HEIGHT - globalYOffset <= HEIGHT - SQUARE_SIZE * 4) {
      globalYOffset = 0
      globalBoxOffset = 0
      startTime = p.millis()
    }
    for (let b of boxes) {
      b.render(globalBoxOffset, globalHalfOffset, globalYOffset)
    }
  }
}
