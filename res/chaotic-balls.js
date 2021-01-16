export const art = (WIDTH, HEIGHT) => {
  return function(p) {
    const BOUNDARIES =
      { left: WIDTH / 5
      , right: WIDTH - WIDTH / 5
      , top: HEIGHT / 5
      , bottom: HEIGHT - HEIGHT / 5
      }

    const NUM_BALLS = 4
    const DIAMETER = (BOUNDARIES.top - BOUNDARIES.bottom) / NUM_BALLS / 4
    const TRAIL_LIFETIME = 1000
    const MAX_TRAILS = 1000
    const RECURRENCE = 300
    let trails = []
    let balls = []
    let lastReset = p.millis()
    let resetDebounce = 1000

    p.setup = function() {
      p.createCanvas(WIDTH, HEIGHT);
      let WIDTH_SPAN = (BOUNDARIES.right - BOUNDARIES.left)
      for (let i = 0; i < NUM_BALLS; i++) {
        let x = BOUNDARIES.left + WIDTH_SPAN / NUM_BALLS * i + WIDTH_SPAN / NUM_BALLS / 2
        let y = BOUNDARIES.top
        let side1 = (x - BOUNDARIES.left) * p.sqrt(2)
        let side2 = (BOUNDARIES.right - x) * p.sqrt(2)
        let pathLength = side1 * 2 + side2 * 2

        let numLoopsInRecurrence = p.pow(2, i)
        let speed = (pathLength * numLoopsInRecurrence) / RECURRENCE
        balls.push(
          { x: x
          , y: y
          , speed:
            { x: speed / p.sqrt(2)
            , y: speed / p.sqrt(2)
            }
          , startingX: x
          , startingY: y
          }
        )
      }
      for (let i = 0; i < MAX_TRAILS; i++) {
        trails.push({ x: 0, y: 0, active: false })
      }
    }

    function allCloseToStarting(balls) {
      for (let ball of balls) {
        if (p.abs(ball.x - ball.startingX) > WIDTH / 30 || p.abs(ball.y - ball.startingY) > WIDTH / 30) return false
      }
      return true
    }

    p.draw = function() {
      p.noStroke()
      p.colorMode(p.HSB)
      p.background(10)

      p.fill(40)
      let reset = allCloseToStarting(balls) && p.millis() - lastReset > resetDebounce
      if (reset) {
        lastReset = p.millis()
      }
      for (let ball of balls) {
        ball.x += ball.speed.x
        ball.y += ball.speed.y
        if (ball.x > BOUNDARIES.right) {
          ball.x = BOUNDARIES.right
          ball.speed.x = -ball.speed.x
        }
        if (ball.x < BOUNDARIES.left) {
          ball.x = BOUNDARIES.left
          ball.speed.x = -ball.speed.x
        }
        if (ball.y < BOUNDARIES.top) {
          ball.y = BOUNDARIES.top
          ball.speed.y = -ball.speed.y
        }
        if (ball.y > BOUNDARIES.bottom) {
          ball.y = BOUNDARIES.bottom
          ball.speed.y = -ball.speed.y
        }
        if (reset) {
          ball.x = ball.startingX
          ball.y = ball.startingY
        }
        p.fill(70)
        p.circle(ball.x, ball.y, DIAMETER)
      }
      for (let ball of balls) {
        for (let trail of trails) {
          if (!trail.active) {
            trail.active = true
            trail.x = ball.x
            trail.y = ball.y
            trail.startTime = p.millis()
            break
          }
        }
      }
      for (let trail of trails) {
        if (!trail.active) continue
        p.push()
        let percentageLife = (p.millis() - trail.startTime) / TRAIL_LIFETIME
        let diameter = p.lerp(DIAMETER, 0, percentageLife)
        let opacity = p.lerp(100, 0, percentageLife)
        p.fill(0, 0, 70, opacity)
        p.circle(trail.x, trail.y, diameter)
        p.pop()
        if (p.millis() - trail.startTime > TRAIL_LIFETIME) {
          trail.active = false
        }
      }
    }
  }
}
