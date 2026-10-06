const fs = require('fs');
const path = require('path');
const GIFEncoder = require('gifencoder');
const jpeg = require('jpeg-js');

async function createCoupleGif() {
  const framePaths = [
    path.join(__dirname, 'assets', 'kiss_frame_1.jpg'),
    path.join(__dirname, 'assets', 'kiss_frame_2.jpg'),
    path.join(__dirname, 'assets', 'kiss_frame_3.jpg')
  ];

  const rawFrames = framePaths.map(p => {
    const buf = fs.readFileSync(p);
    return jpeg.decode(buf, { useTArray: true });
  });

  const origWidth = rawFrames[0].width;
  const origHeight = rawFrames[0].height;
  const targetWidth = 640;
  const targetHeight = Math.round((origHeight / origWidth) * targetWidth);

  function resizeNearest(frame, tw, th) {
    const out = Buffer.alloc(tw * th * 4);
    const xRatio = frame.width / tw;
    const yRatio = frame.height / th;
    for (let y = 0; y < th; y++) {
      const srcY = Math.floor(y * yRatio);
      for (let x = 0; x < tw; x++) {
        const srcX = Math.floor(x * xRatio);
        const srcIdx = (srcY * frame.width + srcX) * 4;
        const dstIdx = (y * tw + x) * 4;
        out[dstIdx] = frame.data[srcIdx];
        out[dstIdx + 1] = frame.data[srcIdx + 1];
        out[dstIdx + 2] = frame.data[srcIdx + 2];
        out[dstIdx + 3] = frame.data[srcIdx + 3];
      }
    }
    return out;
  }

  const resized = rawFrames.map(f => resizeNearest(f, targetWidth, targetHeight));

  const encoder = new GIFEncoder(targetWidth, targetHeight);
  const outPath = path.join(__dirname, 'assets', 'couple_animated.gif');
  const writeStream = fs.createWriteStream(outPath);
  encoder.createReadStream().pipe(writeStream);

  encoder.start();
  encoder.setRepeat(0); // 0 = loop indefinitely
  encoder.setQuality(10);

  // Frame 1: Forehead touch / gazing - 2200ms
  encoder.setDelay(2200);
  encoder.addFrame(resized[0]);

  // Frame 2: Leaning in close - 1400ms
  encoder.setDelay(1400);
  encoder.addFrame(resized[1]);

  // Frame 3: Romantic kiss - 3500ms
  encoder.setDelay(3500);
  encoder.addFrame(resized[2]);

  encoder.finish();

  writeStream.on('finish', () => {
    console.log('Couple GIF created at', outPath, 'Size:', fs.statSync(outPath).size);
  });
}

createCoupleGif().catch(console.error);
