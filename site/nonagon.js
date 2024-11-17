const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const numSides = 9;
const lineThickness = 2;

function drawNonagon() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(canvas.width, canvas.height) / 3;

  const vertices = [];
  for (let i = 0; i < numSides; i++) {
    const angle = ((2 * Math.PI) / numSides) * i - Math.PI / 2; // Adjust angle to start at the top
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    vertices.push({ x, y });
  }

  ctx.strokeStyle = "red";
  ctx.lineWidth = lineThickness;
  ctx.shadowColor = "red";
  ctx.shadowBlur = 30;

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

window.addEventListener("resize", drawNonagon);
drawNonagon();
