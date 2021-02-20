export const art = (WIDTH, HEIGHT) => {
  const CHAR_SIZE = WIDTH / 30

  return function(p) {
    class FallingStream {
      constructor(x, length) {
        this.x = x
        this.chars = []
        this.trailLength = length
        let startTime = p.millis()
        for (let i = 0; i < this.trailLength; i++) {
          let color = i < 2 ? p.color(100) : p.color(131, 100, 100)
          color.setAlpha(p.lerp(1, 0, i / this.trailLength))
          this.chars.push(new FallingChar(x, CHAR_SIZE, -i, color, startTime, i))
        }
        this.startTime = p.millis()
      }

      render(t) {
        for (let c of this.chars) {
          c.render(t)
        }
      }

      isDead() {
        return p.millis() - this.startTime > 10000
      }
    }

    class FallingChar {
      constructor(x, charSize, startRow, color, startTime, changeRate) {
        this.x = x
        this.c = String.fromCharCode(p.random(33, 126))
        this.charSize = charSize
        this.startRow = startRow
        this.color = color

        this.startTime = startTime

        this.numRows = HEIGHT / CHAR_SIZE
        this.changeRate = changeRate
        this.changeCount = 0
        this.fallRate = 1 / 100
        this.totalTime = this.numRows / this.fallRate
      }

      render(t) {
        let lastRow = this.row
        this.row = p.floor(p.lerp(0, this.numRows, (t - this.startTime) / this.totalTime)) + this.startRow
        if (lastRow != this.row) this.changeCount++
        if (this.changeCount > this.changeRate) {
          this.changeCount = 0
          this.c = String.fromCharCode(p.random(33, 126))
        }
        p.fill(this.color)
        p.text(this.c, this.x, this.row * this.charSize, this.charSize, this.charSize)
      }
    }

    let streams = []
    const STREAM_SPAWN_RATE = 500
    const NUM_COLS = WIDTH / CHAR_SIZE
    let lastStreamSpawn = 0

    let columnOrder = []
    let lastSpawned = 0

    let shuffle = (a) => {
      for (let i = a.length - 1; i > 0; i--) {
          const j = p.floor(p.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    p.setup = function() {
      p.createCanvas(WIDTH, HEIGHT)
      p.colorMode(p.HSB)
      p.textFont('Roboto')
      p.textAlign(p.CENTER, p.CENTER)
      for (let i = 0; i < NUM_COLS; i++) {
        columnOrder.push(i)
      }
      columnOrder = shuffle(columnOrder)
    }

    p.draw = function() {
      p.background(0)
      p.textSize(CHAR_SIZE)
      if (p.millis() - lastStreamSpawn > STREAM_SPAWN_RATE) {
        lastStreamSpawn = p.millis()
        streams.push(new FallingStream(CHAR_SIZE * columnOrder[lastSpawned], p.random(10, 50)))
        lastSpawned = (lastSpawned + 1) % NUM_COLS
      }
      for (let i = streams.length - 1; i >= 0; i--) {
        let stream = streams[i]
        stream.render(p.millis())
        if (stream.isDead()) {
          streams.splice(i, 1)
        }
      }
    }
  }
}
