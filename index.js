const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = `colortest.png`;
const width = 800;
const height = 500;

const xCenter = width / 2;
const yCenter = height / 2;
const ledSize = 2;

const numLED = 42;
const ledMaxRadius = 200; // 11.5 ""
const ledMinRadius = ledMaxRadius / 3.83; // 3 ""
const distBetweenLeds = (ledMaxRadius - ledMinRadius) / numLED;
const refreshRateAngle = 1;
const ledArray = [];
img.crossOrigin = "Anonymous";
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");
ctx.arc(xCenter, yCenter, 20, 0, Math.PI);

ctx2.fillRect(0, 0, width, height);
ctx.fillRect(0, 0, width, height);

const amp = 1;
const bias = 0;

const curve = (c) => {
  const x = (c / 255 - 0.5 + bias) * 2 * amp;
  const absX = Math.abs(x);
  const sign = x > 0 ? 1 : -1;
  const curved = sign * (1 - Math.pow(Math.E, -1 * absX));
  const res = Math.floor((0.5 + curved / 2) * 255);

  return res;
};

img.onload = () => {
  ctx2.drawImage(img, 150, 10, 500, 500);
  const d = ctx2.getImageData(0, 0, width, height).data;

  for (let i = 0; i < 360; i += refreshRateAngle) {
    for (
      let dist = ledMinRadius;
      dist < ledMinRadius + distBetweenLeds * numLED;
      dist += distBetweenLeds
    ) {
      const x = dist * Math.sin((i * Math.PI) / 180);
      const y = dist * Math.cos((i * Math.PI) / 180);
      const pixelNum =
        (Math.round(y + yCenter) * width + Math.round(x + xCenter)) * 4;
      const red = curve(d[pixelNum]);
      const green = curve(d[pixelNum + 1]);
      const blue = curve(d[pixelNum + 2]);
      ledArray.push(red);
      ledArray.push(green);
      ledArray.push(blue);
    }
  }

  for (
    let dist = ledMinRadius;
    dist < ledMinRadius + distBetweenLeds * numLED;
    dist += distBetweenLeds
  ) {
    for (let i = 0; i < 360; i += refreshRateAngle) {
      const x = dist * Math.sin((i * Math.PI) / 180);
      const y = dist * Math.cos((i * Math.PI) / 180);
      const pixelNum =
        (Math.round(y + yCenter) * width + Math.round(x + xCenter)) * 4;
      const red = curve(d[pixelNum]);
      const green = curve(d[pixelNum + 1]);
      const blue = curve(d[pixelNum + 2]);

      //console.log(d)
      // const red = d[pixelNum][0]
      // const green = d[pixelNum][1]
      // const blue = d[pixelNum][2]
      // ctx.fillStyle = `rgb(
      //   ${red},
      //   ${green},
      //     ${blue})`

      // ctx.fillRect(x + xCenter, y + yCenter, ledSize, ledSize)
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = `rgb(
        ${red},
        ${green},
          ${blue})`;
      ctx.beginPath();

      ctx.arc(
        xCenter,
        yCenter,
        dist,
        (i * Math.PI) / 180 + Math.PI / 2,
        (i * Math.PI) / 180 + (refreshRateAngle * Math.PI) / 180 + Math.PI / 2
      );
      ctx.stroke();
    }
  }

  let str = `{`;
  ledArray.forEach((num) => {
    str += num;
    str += ",";
  });
  str = str.slice(0, -1);
  str += "};";

  console.log(str);
  console.log(ledArray.length);
};

// 1 2 3 4 5 6 7 8 9
