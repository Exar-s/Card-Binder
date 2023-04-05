let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.src = url;
  });
}

async function draw() {
  const imgArr = [
    'images/11.png',
    'frameimgs/3.png',
    'class/gold-lancer.png',
  ];
  const [ser, frame, icon] = await Promise.all(imgArr.map(loadImage));
  roundedImage(0, 10, 400, 630, 20);
  ctx.save();
  ctx.clip();
  ctx.drawImage(ser, 0, 10, 400, 640);
  ctx.restore()
  ctx.drawImage(frame, -9, -40, 420, 770);
  ctx.drawImage(icon, 168, 589, 64, 64);
  // drawStar(200, 20, 5, 10, 5);
  //2 star
  // drawStar(186.5, 20, 5, 10, 5);
  // drawStar(211.5, 20, 5, 10, 5);
  //3 star
  drawStar(200, 20, 5, 10, 5);
  drawStar(176, 20, 5, 8, 4);
  drawStar(224, 20, 5, 8, 4);
  //4 star
  // drawStar(188, 20, 5, 10, 5);
  // drawStar(212, 20, 5, 10, 5);
  // drawStar(164, 20, 5, 8, 4);
  // drawStar(236, 20, 5, 8, 4);
  //5 star
  // drawStar(197.5, 20, 5, 10, 5);
  // drawStar(176, 20, 5, 8, 4);
  // drawStar(224, 20, 5, 8, 4);
  // drawStar(152, 20, 5, 6, 3);
  // drawStar(248, 20, 5, 6, 3);
  ctx.textAlign = 'center';
  ctx.font = 'italic bold 21px Arial';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'black';
  console.log('Assassin of the Nightless City (Caster)'.length)
  console.log('Demon King Nobunaga (Oda Nobunaga)'.length)
  console.log('Anne Bonny & Mary Read (Archer)'.length)
  ctx.strokeText("Anne Bonny & Mary Read (Archer)", 200, 560);
  ctx.fillStyle = 'white';
  ctx.fillText("Anne Bonny & Mary Read (Archer)", 200, 560);
  ctx.font = 'bold 15px Arial';
  ctx.strokeStyle = 'black';
  ctx.strokeText('Lancer', 200, 583);
  ctx.fillStyle = 'white';
  ctx.fillText('Lancer', 200, 583);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(50, 565);
  ctx.lineTo(350, 565);
  const gradient1 = ctx.createLinearGradient(50, 565, 350, 565);
  gradient1.addColorStop(0, 'rgba(255,255,255,0)');
  gradient1.addColorStop(0.2, 'black');
  gradient1.addColorStop(0.8, 'black');
  gradient1.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.strokeStyle = gradient1;
  ctx.stroke();
  const gradient2 = ctx.createLinearGradient(50, 565, 350, 565);
  gradient2.addColorStop(0, 'rgba(255,255,255,0)');
  gradient2.addColorStop(0.2, 'white');
  gradient2.addColorStop(0.8, 'white');
  gradient2.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.strokeStyle = gradient2;
  ctx.stroke();
  // const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  // var element = document.createElement('a');
  // var filename = 'test.png';
  // element.setAttribute('href', image);
  // element.setAttribute('download', filename);
  // element.click();
}

draw();

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
  var rot = (Math.PI / 2) * 3;
  var x = cx;
  var y = cy;
  var step = Math.PI / spikes;

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



// frame.onload = function () {
//   ctx.drawImage(img, 0, 10, 400, 630);
//   ctx.drawImage(frame, -3, -30, 410, 760);
//   ctx.textAlign = 'center';
//   ctx.font = '35px serif';
//   ctx.strokeStyle = 'black';
//   ctx.lineWidth = 3;
//   ctx.strokeText('Hero_nameHero_nameHero_nameHero_nameHero_name', 200, 550);
//   ctx.fillStyle = 'white';
//   ctx.fillText('Hero_nameHero_nameHero_nameHero_nameHero_name', 200, 550);
// };

//https://www.youtube.com/watch?v=3c2EFpCr_vY
///https://github.com/meguerreroa/FGO-Card-Generator/blob/master/fgo.html
//https://stackoverflow.com/questions/73326189/how-do-i-draw-multiple-images-onto-the-canvas-at-once
//https://stackoverflow.com/questions/7496674/how-to-rotate-one-image-in-a-canvas
//https://stackoverflow.com/questions/25816847/canvas-context-filltext-vs-context-stroketext
//http://jsfiddle.net/huds0fr7/
//https://stackoverflow.com/questions/25837158/how-to-draw-a-star-by-using-canvas-html5
//https://stackoverflow.com/questions/19585999/canvas-drawimage-with-round-corners
