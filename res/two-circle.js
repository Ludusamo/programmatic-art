export const art = (WIDTH, HEIGHT) => {
  return function(p) {
    const MIN_DIAMETER = WIDTH * 15 / 300
    const MAX_DIAMETER = WIDTH / 3

    const SATURATION = 75
    const VALUE = 66

    p.setup = function() {
      p.createCanvas(WIDTH, HEIGHT);
    }

    p.draw = function() {
      p.colorMode(p.HSB)
      const circleHue = p.abs(p.sin(p.millis() / 5223) * 255)
      const backgroundHue = (circleHue + 120) % 360
      const circleHue2 = (backgroundHue + 120) % 360
      p.background(backgroundHue, SATURATION, VALUE)

      const diameter = MIN_DIAMETER + ((MAX_DIAMETER - MIN_DIAMETER) * p.abs(p.sin(p.millis() / 2134)))
      const maxBound = (WIDTH / 2) - (diameter / 2)

      p.fill(circleHue, SATURATION, VALUE)
      p.circle((WIDTH / 2) + maxBound * p.sin(p.millis() / 1500 - p.HALF_PI),
               (HEIGHT / 2) + maxBound * p.sin(p.millis() / 750 - p.HALF_PI),
               diameter)
      p.fill(circleHue2, SATURATION, VALUE)
      p.circle((WIDTH / 2) + maxBound * p.sin(p.millis() / 1500 + p.HALF_PI),
               (HEIGHT / 2) + maxBound * p.sin(p.millis() / 750 + p.HALF_PI),
               diameter)
    }
  }
}
