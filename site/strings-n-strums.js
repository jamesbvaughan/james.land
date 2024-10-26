// =============================================================================
// Setup

const notes = [
  220.0, // A3
  246.94, // B3
  261.63, // C4
  293.66, // D4
  329.63, // E4
  349.23, // F4
  392.0, // G4
  440.0, // A4
  493.88, // B4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  698.46, // F5
  783.99, // G5
  880.0, // A5
];

const dragThresholdPx = 10;

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext("2d");

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
handleColorSchemeChange(darkModeMediaQuery);
darkModeMediaQuery.addEventListener("change", handleColorSchemeChange);
function handleColorSchemeChange() {
  context.strokeStyle = getComputedStyle(document.body).getPropertyValue(
    "--fg",
  );
}

const audioContext = new AudioContext();

// =============================================================================
// State

let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

let strums = 0;

let lastCursorX, lastCursorY;

const lines = [];
let lineInProgress = null;

// =============================================================================
// Utils

function doLinesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (denominator === 0) return false; // Lines are parallel

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

function didCrossLine(line, cursorX, cursorY) {
  return (
    lastCursorX != null &&
    lastCursorY != null &&
    doLinesIntersect(
      line.startX,
      line.startY,
      line.endX,
      line.endY,
      lastCursorX,
      lastCursorY,
      cursorX,
      cursorY,
    )
  );
}

const computeLineLength = (line) =>
  Math.hypot(line.endX - line.startX, line.endY - line.startY);

const noteForLine = (line) => {
  const screenDiagonal = Math.hypot(canvas.width, canvas.height);
  const lineLength = computeLineLength(line);
  const index =
    notes.length - Math.floor((lineLength / screenDiagonal) * notes.length) - 1;
  return notes[index];
};

// =============================================================================
// Listeners

function onPoint(x, y) {
  if (lineInProgress) {
    lineInProgress.endX = x;
    lineInProgress.endY = y;

    lines.push(lineInProgress);
    lineInProgress = null;

    if (lines.length === 1 && strums < 3) {
      clickAround.style.display = "none";
      nowStrum.style.display = "block";
    }
  } else {
    lineInProgress = {
      startX: x,
      startY: y,
      endX: x,
      endY: y,
    };
  }
}

function onMove(x, y) {
  if (lineInProgress) {
    lineInProgress.endX = x;
    lineInProgress.endY = y;
  }

  for (const line of lines) {
    if (didCrossLine(line, x, y)) {
      const frequency = noteForLine(line);
      playTone(frequency, 1);
      strums++;

      if (strums === 3) {
        nowStrum.style.display = "none";
      }
    }
  }

  lastCursorX = x;
  lastCursorY = y;
}

let pointStartX, pointStartY;

canvas.addEventListener("pointerup", (event) => {
  const distance = Math.hypot(
    pointStartX - event.clientX,
    pointStartY - event.clientY,
  );
  if (distance < dragThresholdPx) {
    onPoint(pointStartX, pointStartY);
  }
});

canvas.addEventListener("pointerdown", (event) => {
  pointStartX = event.clientX;
  pointStartY = event.clientY;
});
canvas.addEventListener("touchstart", (event) => {
  event.preventDefault();
});

canvas.addEventListener("pointerleave", () => {
  lastCursorX = null;
  lastCursorY = null;
});

canvas.addEventListener("pointermove", (event) => {
  onMove(event.clientX, event.clientY);
});

clearButton.addEventListener("click", () => {
  lines.length = 0;
});

function updateSoundButton() {
  if (audioContext.state === "running") {
    soundIcon.style.display = "block";
    muteIcon.style.display = "none";
  } else {
    soundIcon.style.display = "none";
    muteIcon.style.display = "block";
  }
}
audioContext.addEventListener("statechange", updateSoundButton);

audioContext.resume();

soundButton.addEventListener("click", () => {
  if (audioContext.state === "running") {
    audioContext.suspend();
  } else if (audioContext.state === "suspended") {
    audioContext.resume();
  }
});

document.addEventListener("touchstart", startAudioContext);
document.addEventListener("pointerdown", startAudioContext);
document.addEventListener("click", startAudioContext);
document.addEventListener("visibilitychange", startAudioContext);

// =============================================================================
// Rendering

function drawLine(line) {
  context.beginPath();
  context.lineWidth = 4;
  context.moveTo(line.startX, line.startY);
  context.lineTo(line.endX, line.endY);
  context.stroke();
  context.closePath();
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (const line of lines) {
    drawLine(line);
  }
  if (lineInProgress) {
    drawLine(lineInProgress);
  }

  requestAnimationFrame(render);
}

render();

// =============================================================================
// Sounds

function startAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === "suspended" && !document.hidden) {
    audioContext.resume();
  }
}

function makeDistortionCurve(amount) {
  const samples = 44100;
  const curve = new Float32Array(samples);
  const deg = Math.PI / 180;

  for (let i = 0; i < samples; ++i) {
    const x = (i * 2) / samples - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

const distortionCurve = makeDistortionCurve(50);

function playTone(frequency, duration) {
  if (audioContext.state !== "running") {
    return;
  }

  const osc1 = audioContext.createOscillator();
  const osc2 = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  osc1.type = "sine";
  osc2.type = "triangle";

  osc1.frequency.value = frequency;
  osc2.frequency.value = frequency * 2; // Octave higher

  const distortion = audioContext.createWaveShaper();
  distortion.curve = distortionCurve;

  osc1.connect(distortion);
  osc2.connect(distortion);
  distortion.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Envelope
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + duration,
  );

  osc1.start();
  osc2.start();
  osc1.stop(audioContext.currentTime + duration);
  osc2.stop(audioContext.currentTime + duration);
}
