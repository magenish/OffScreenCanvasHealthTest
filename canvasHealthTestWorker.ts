class Color {
  private r: number;
  private g: number;
  private b: number;
  private static _white: Color = null;
  private static _red: Color = null;

  /**
   * Initializes a new instance of the @see Color class.
   * Although this method allows a 32-bit value to be passed for each
   * component, the value of each component is limited to 8 bits.
   *
   * @param red   The red component. Valid values are 0 through 255.
   * @param green   The green component. Valid values are 0 through 255.
   * @param blue   The blue component. Valid values are 0 through 255.
   */
  public constructor(red: number, green: number, blue: number) {
    this.r = Color.castToByte(red, "red");
    this.g = Color.castToByte(green, "green");
    this.b = Color.castToByte(blue, "blue");
  }

  private static castToByte(value: number, name: string): number {
    if (value < 0 || value > 255) {
      console.log(
        `Color.CastToByte: The '${name}' component value is out of range: ${value}`
      );
      throw new Error(
        `${name} The RGB component is out of range. Valid values are 0 through 255.`
      );
    }

    return value as number;
  }
}

class ColorTranslator {
  public static toHtml(color): string {
    const redHex = this.hexStringFromByte(color.r);
    const greenHex = this.hexStringFromByte(color.g);
    const blueHex = this.hexStringFromByte(color.b);
    return "#" + redHex + greenHex + blueHex;
  }
  
  private static hexStringFromByte(value: number): string {
    const hex = value.toString(16);
    return hex.length === 2 ? hex : "0" + hex;
  }
}

var globalCanvas = undefined;
var cnt = 0;
const font = "50px serif";
const redColor = new Color(255, 0, 0);
const redPixel = {color:redColor , x: 0, y: 0 };
const greenColor = new Color(0, 255, 0);
const greenPixel = {color:greenColor , x: 1, y: 0 };
const blueColor = new Color(0, 0, 255);
const bluePixel = {color:blueColor , x: 0, y: 1 };
const yellowColor = new Color(255, 255, 0);
const yellowPixel = {color:yellowColor , x: 1, y: 1 };
self.onmessage = function (evt) {
  globalCanvas = evt.data.canvas;
  createTestableCanvasElement();
  // spin up periodical health test.
  setInterval(healthTest, 1000);
};

enum PixelCompareResult {
  success = 0,
  failedWithBlackColor = 1,
  failed = 2,
}

enum CanvasHealthCheckResult {
  healthy = 0,
  failedToRunCheck = 1,
  notHealthyBuffersEmpty = 2,
  notHealthyRandomValues = 3,
}

function healthTest() {
  var imgData = globalCanvas.getContext("2d").getImageData(0, 0, 2, 2);
  disposeCanvas();
  createTestableCanvasElement();
  const result = validateCanvasPattern(imgData);

  switch (result) {
    case PixelCompareResult.success:
      console.log("health test succeed");
      return CanvasHealthCheckResult.healthy;

    case PixelCompareResult.failedWithBlackColor:
      console.log("health test failed With Black Color");
      return CanvasHealthCheckResult.notHealthyBuffersEmpty;

    default:
      console.log("health test not Healthy Random Values");
      return CanvasHealthCheckResult.notHealthyRandomValues;
  }
}

function createTestableCanvasElement() {
  try {
    globalCanvas.id = "myCanvas";
    // Set the canvas dimensions
    globalCanvas.width = 2;
    globalCanvas.height = 2;
    cnt++;
    var ctx = globalCanvas.getContext("2d");
    drawSamplePatternOnCanvas(ctx);
  } catch (exception) {
    return null;
  }
}

function validateCanvasPattern(imageData) {
  const redResult = validatePixel(imageData, redPixel);
  const greenResult = validatePixel(imageData, greenPixel);
  const blueResult = validatePixel(imageData, bluePixel);
  const yellowResult = validatePixel(imageData, yellowPixel);

  if (
    redResult === PixelCompareResult.success &&
    greenResult === PixelCompareResult.success &&
    blueResult === PixelCompareResult.success &&
    yellowResult === PixelCompareResult.success
  ) {
    return PixelCompareResult.success;
  }

  if (
    redResult === PixelCompareResult.failedWithBlackColor &&
    greenResult === PixelCompareResult.failedWithBlackColor &&
    blueResult === PixelCompareResult.failedWithBlackColor &&
    yellowResult === PixelCompareResult.failedWithBlackColor
  ) {
    return PixelCompareResult.failedWithBlackColor;
  }

  return PixelCompareResult.failed;
}

function validatePixel(imageData, pixel) {
  // Retrieve the position of the pixel in the imageData array per imageData spec.
  // Each pixel is represented by 4 bytes ordered RGBA
  const offset = 4 * (imageData.width * pixel.y + pixel.x);
  const red = imageData.data[offset];
  const green = imageData.data[offset + 1];
  const blue = imageData.data[offset + 2];
  const alpha = imageData.data[offset + 3];

  if (
    !arePixelByteWithinErrorRange(red, pixel.color.r) ||
    !arePixelByteWithinErrorRange(green, pixel.color.g) ||
    !arePixelByteWithinErrorRange(blue, pixel.color.b) ||
    !arePixelByteWithinErrorRange(alpha, 255)
  ) {
    if (!red && !green && !blue && !alpha) {
      // pixel buffer is empty (black pixel = 0x000000)
      return PixelCompareResult.failedWithBlackColor;
    }

    return PixelCompareResult.failed;
  }

  return PixelCompareResult.success;
}

function arePixelByteWithinErrorRange(byte1, byte2) {
  const bottomRange = Math.max(0, byte1 - 2);
  const topRange = Math.min(255, byte1 + 2);

  // byte2 is within the valid error range in compare to byte1
  if (byte2 >= bottomRange && byte2 <= topRange) {
    return true;
  }

  return false;
}

/**
 * Draw Sample pattern on the canvas with 1px of each color:
 * |  Red   | Green  |
 * |--------|--------|
 * |  Blue  | Yellow |
 */
function drawSamplePatternOnCanvas(ctx) {
  drawPixel(ctx, redPixel);
  drawPixel(ctx, greenPixel);
  drawPixel(ctx, bluePixel);
  drawPixel(ctx, yellowPixel);
}
function drawPixel(ctx, pixel) {
  ctx.fillStyle = ColorTranslator.toHtml(pixel.color);
  ctx.fillRect(pixel.x, pixel.y, 1, 1);
}

function disposeCanvas() {
  globalCanvas.width = 0;
  globalCanvas.height = 0;
}
