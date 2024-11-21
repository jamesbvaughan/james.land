const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const numSides = 9;
const lineThickness = 2;

const vertices = [];
for (let i = 0; i < numSides; i++) {
  vertices[i] = { x: 0, y: 0 };
}

function drawNonagon(centerX, centerY, radius, rotation, shadowBlur) {
  ctx.strokeStyle = "red";
  ctx.lineWidth = lineThickness;
  ctx.shadowColor = "red";
  ctx.shadowBlur = shadowBlur;

  for (let i = 0; i < numSides; i++) {
    const angle = ((2 * Math.PI) / numSides) * i - Math.PI / 2 + rotation;
    vertices[i].x = centerX + radius * Math.cos(angle);
    vertices[i].y = centerY + radius * Math.sin(angle);
  }

  for (let i = 0; i < numSides; i++) {
    for (let j = i + 1; j < numSides; j++) {
      ctx.beginPath();
      ctx.moveTo(vertices[i].x, vertices[i].y);
      ctx.lineTo(vertices[j].x, vertices[j].y);
      ctx.stroke();
    }
  }

  ctx.beginPath();
  for (let i = 0; i < numSides; i++) {
    const nextIndex = (i + 1) % numSides;
    ctx.moveTo(vertices[i].x, vertices[i].y);
    ctx.lineTo(vertices[nextIndex].x, vertices[nextIndex].y);
  }
  ctx.stroke();
}

let rotation = 0;

let cssWidth, cssHeight, dpr;
function resizeCanvas() {
  dpr = window.devicePixelRatio || 1;

  cssWidth = window.innerWidth;
  cssHeight = window.innerHeight;

  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;

  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  ctx.scale(dpr, dpr);
}

window.addEventListener("resize", resizeCanvas);

function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

  const centerX = canvas.width / dpr / 2;
  const centerY = canvas.height / dpr / 2;

  const size = Math.min(cssWidth, cssHeight) / 2 - 24;
  rotation += 0.0001;
  const shadowBlur = Math.floor((Math.sin(timestamp / 1000) + 1) * 48);
  drawNonagon(centerX, centerY, size, rotation, shadowBlur);

  requestAnimationFrame(animate);
}

resizeCanvas();
animate();
