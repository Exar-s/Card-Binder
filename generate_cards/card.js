const { createCanvas, loadImage } = require('canvas');
const servantList = require('./servants.json');
const fs = require('fs');

const WIDTH = 400;
const HEIGHT = 650;
const STARSEP = 24;
const BORDER = 10;
const ICONSIZE = 64;
const iconColors = ['bronze', 'silver', 'gold'];
const bg = ['#48371C', '#A8A9AD', '#AE8625'];
// const bg = ['#000000', '#FFFFFF', '#AE8625'];

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');
// const arr = servantList.map((serv) => serv.id);

async function drawAll(servantList) {
  for (const servant of servantList) {
    if(servant.id > 373){
      await draw(servant)
    }
  }
}

drawAll(servantList);

async function draw(servant) {
  const grade = servant.rarity < 3 ? 0 : servant.rarity > 3 ? 2 : 1;
  // console.log(servant.name, grade, bg[grade]);
  const iconColor = iconColors[grade];
  ctx.fillStyle = bg[grade];
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  const ser = await loadImage(`images/${servant.id}.png`);
  // const index = arr.indexOf(servant.id);
  // if (index > -1) {
  //   arr.splice(index, 1);
  // }
  // console.log(arr);
  const frame = await loadImage(`frameimgs/${servant.rarity}.png`);
  const icon = await loadImage(
    `class/${iconColor}-${servant.servantClass
      .toLowerCase()
      .split(' ')
      .join('')}.png`
  );
  roundedImage(0, BORDER, WIDTH, HEIGHT - 20, 20);
  ctx.save();
  ctx.clip();
  ctx.drawImage(ser, 0, 10, WIDTH, 640);
  ctx.restore();
  let frameX = servant.rarity === 3 ? -10 : -11
  ctx.drawImage(frame, frameX, -40, 420, 770);
  ctx.drawImage(
    icon,
    WIDTH / 2 - ICONSIZE / 2,
    HEIGHT - ICONSIZE + 4,
    ICONSIZE,
    ICONSIZE
  );
  drawRarity(servant.rarity);
  details(servant.name, servant.servantClass);
  const buffer = canvas.toBuffer('image/png');
  await fs.promises.writeFile(`./cards/${servant.id}.png`, buffer);
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function details(name, servantClass) {
  const nameLocation = 555;
  const classLocation = 583;
  const lineLocation = 565;
  const lineStart = 100;
  const lineEnd = 300;
  ctx.textAlign = 'center';
  ctx.font =
    name.length > 30 ? 'italic bold 21px Arial' : 'italic bold 25px Arial';
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'black';
  ctx.strokeText(name, WIDTH / 2, nameLocation);
  ctx.fillStyle = 'white';
  ctx.fillText(name, WIDTH / 2, nameLocation);
  ctx.font = 'bold 15px Arial';
  ctx.strokeStyle = 'black';
  ctx.strokeText(servantClass, WIDTH / 2, classLocation);
  ctx.fillStyle = 'white';
  ctx.fillText(servantClass, WIDTH / 2, classLocation);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(lineStart, lineLocation);
  ctx.lineTo(lineEnd, lineLocation);
  const gradient1 = ctx.createLinearGradient(
    lineStart,
    lineLocation,
    lineEnd,
    lineLocation
  );
  gradient1.addColorStop(0, 'rgba(255,255,255,0)');
  gradient1.addColorStop(0.2, 'black');
  gradient1.addColorStop(0.8, 'black');
  gradient1.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.strokeStyle = gradient1;
  ctx.stroke();
  const gradient2 = ctx.createLinearGradient(
    lineStart,
    lineLocation,
    lineEnd,
    lineLocation
  );
  gradient2.addColorStop(0, 'rgba(255,255,255,0)');
  gradient2.addColorStop(0.2, 'white');
  gradient2.addColorStop(0.8, 'white');
  gradient2.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.strokeStyle = gradient2;
  ctx.stroke();
}

function drawRarity(rarity) {
  const starLocation = 20;
  let outerRadius = 10;
  let innerRadius = 5;
  const mid = WIDTH / 2;
  if (rarity % 2 === 0) {
    const leftMid = mid - STARSEP / 2;
    const rightMid = mid + STARSEP / 2;
    drawStar(leftMid, starLocation, 5, outerRadius, innerRadius);
    drawStar(rightMid, starLocation, 5, outerRadius, innerRadius);
    if (rarity > 2) {
      drawStar(
        leftMid - STARSEP,
        starLocation,
        5,
        outerRadius - 2,
        innerRadius - 1
      );
      drawStar(
        rightMid + STARSEP,
        starLocation,
        5,
        outerRadius - 2,
        innerRadius - 1
      );
    }
  } else {
    drawStar(mid, starLocation, 5, outerRadius, innerRadius);
    if (rarity > 1) {
      drawStar(
        mid + STARSEP,
        starLocation,
        5,
        outerRadius - 2,
        innerRadius - 1
      );
      drawStar(
        mid - STARSEP,
        starLocation,
        5,
        outerRadius - 2,
        innerRadius - 1
      );
      if (rarity > 3) {
        drawStar(
          mid + STARSEP * 2,
          starLocation,
          5,
          outerRadius - 4,
          innerRadius - 2
        );
        drawStar(
          mid - STARSEP * 2,
          starLocation,
          5,
          outerRadius - 4,
          innerRadius - 2
        );
      }
    }
  }
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  let step = Math.PI / spikes;

  ctx.strokeSyle = '#000';
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'gold';
  ctx.stroke();
  ctx.fillStyle = 'yellow';
  ctx.fill();
}

function roundedImage(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
