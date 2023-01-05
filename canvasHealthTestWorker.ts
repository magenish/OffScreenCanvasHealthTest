var canvas = undefined;
self.onmessage = function(evt) {
    canvas = evt.data.canvas;
    createTestableCanvasElement(canvas);  
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
  var imgData = canvas.getContext("2d").getImageData(0, 0, 2, 2);
  createTestableCanvasElement(canvas);
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

function validateCanvasPattern(imageData) {
  const redResult = validatePixel(imageData, { color: "red", x: 0, y: 0 });

  if (redResult === PixelCompareResult.success) {
    return PixelCompareResult.success;
  }

  if (redResult === PixelCompareResult.failedWithBlackColor) {
    return PixelCompareResult.failedWithBlackColor;
  }

  return PixelCompareResult.failed;
}

function validatePixel(imageData, pixel) {
  // Retrieve the position of the pixel in the imageData array per imageData spec.
  // Each pixel is represented by 4 bytes ordered RGBA
  const offset = 4 * (imageData.width * pixel.y + pixel.x);
  const red = imageData.data[offset];

  if (!arePixelByteWithinErrorRange(red, pixel.color.r)) {
    if (!red) {
      // pixel buffer is empty (black pixel = 0x000000)
      return PixelCompareResult.failedWithBlackColor;
    }

    return PixelCompareResult.success;
  }

  return 0;
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

function createTestableCanvasElement(canvas) {
    try {
        var canvas = createTestableCanvasElementHelper(400, "myCanvas", canvas);
        var ctx = canvas.getContext("2d", { willReadFrequently: false });
        drawSamplePatternOnCanvas(ctx);
        return canvas;
    }
    catch (exception) {
        return null;
    }
}

function createTestableCanvasElementHelper(size, id, canvas) {
    canvas.id = id;
    // Set the canvas dimensions
    canvas.width = size.toString();
    canvas.height = size.toString();
    return canvas;
}


/**
 * Draw Sample pattern on the canvas with 1px of each color:
 * |  Red   | Green  |
 * |--------|--------|
 * |  Blue  | Yellow |
 */
function drawSamplePatternOnCanvas(ctx) {
    drawPixel(ctx, { color: "red", x: 0, y: 0 });
    drawPixel(ctx, { color: "green", x: 100, y: 0 });
    drawPixel(ctx, { color: "blue", x: 0, y: 100 });
    drawPixel(ctx, { color: "yellow", x: 100, y: 100 });
}
function drawPixel(ctx, pixel) {
    ctx.fillStyle = pixel.color;
    ctx.fillRect(pixel.x, pixel.y, 100, 100);
}