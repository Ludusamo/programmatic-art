export const art = p => {
  const WIDTH = 500
  const HEIGHT = 500

  const MIN_DIAMETER = 33
  const MAX_DIAMETER = 133

  const SATURATION = 75
  const VALUE = 66

  p.setup = function() {
    p.createCanvas(WIDTH, HEIGHT);
  }

  p.draw = function() {
    p.colorMode(p.HSB)
    const circleHue = p.abs(p.sin(p.millis() / 5223) * 255)
    const backgroundHue = (circleHue + 180) % 360
    p.background(backgroundHue, SATURATION, VALUE)

    const diameter = MIN_DIAMETER + ((MAX_DIAMETER - MIN_DIAMETER) * p.abs(p.sin(p.millis() / 2134)))
    const maxBound = (WIDTH / 2) - (diameter / 2)

    p.translate(maxBound * p.sin(p.millis() / 1500), maxBound * p.sin(p.millis() / 750))
    p.fill(circleHue, SATURATION, VALUE)
    p.circle(WIDTH / 2, HEIGHT / 2, diameter)
  }
}
