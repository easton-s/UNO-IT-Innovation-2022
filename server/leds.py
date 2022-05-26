import time

from rpi_ws281x import Color, PixelStrip

# LED strip configuration:
LED_COUNT = 300        # Number of LED pixels.
LED_PIN = 18          # GPIO pin connected to the pixels (must support PWM!).
LED_FREQ_HZ = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA = 10          # DMA channel to use for generating signal (try 10)
LED_BRIGHTNESS = 255  # Set to 0 for darkest and 255 for brightest
LED_INVERT = False    # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL = 0

strip = PixelStrip(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL)
strip.begin()

COLOR_MATCH = {
    'red': Color(255, 0, 0),
    'blue': Color(0, 255, 0),
    'green': Color(0, 0, 255),
    'white': Color(255, 255, 255),
}

# Wipe color across display a pixel at a time.
def colorWipe(color, wait_ms=50):
    for i in range(strip.numPixels()):
        strip.setPixelColor(i, color)
        strip.show()
        time.sleep(wait_ms / 1000.0)

def clearStrip():
    for i in range(LED_COUNT):
        strip.setPixelColor(i, Color(0, 0, 0))
    strip.show()

# Set specific led range to color
def setColors(from_led, to_led, color, wait_ms=0):
    for i in range(from_led, to_led):
        strip.setPixelColor(i, COLOR_MATCH[color])
        strip.show()
        if wait_ms != 0:
            time.sleep(wait_ms / 1000)

