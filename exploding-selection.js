const maxDepartVelocity = 0.5;
const maxReturnVelocity = 5;
const explosionDelayMs = 50;

const explodeStates = new Map();

function initialize() {
  explodeStates.clear();

  document.querySelectorAll(".explode").forEach((explodeContainer) => {
    const oldGhost = explodeContainer.querySelector(".ghost");
    if (oldGhost) {
      explodeContainer.removeChild(oldGhost);
    }

    const text = explodeContainer.textContent.trim();

    // Create an invisible element in order to retain the document layout
    const ghostElement = document.createElement("span");
    ghostElement.className = "ghost";
    ghostElement.textContent = text;
    ghostElement.style.opacity = 0;
    ghostElement.style.pointerEvents = "none";

    explodeContainer.replaceChildren(
      // Replace each character with a <span>
      ...text.split("").map((character) => {
        const span = document.createElement("span");
        span.className = "explodable";
        span.textContent = character;
        return span;
      }),
      document.createTextNode(" "),
      ghostElement,
    );

    // Set up the state tracking map
    const containerRect = explodeContainer.getBoundingClientRect();
    explodeContainer.querySelectorAll(".explodable").forEach((explodable) => {
      const rect = explodable.getBoundingClientRect();
      explodeStates.set(explodable, {
        element: explodable,
        exploding: false,
        selected: false,
        x: 0,
        y: 0,
        top: rect.top - containerRect.top,
        left: rect.left - containerRect.left,
        angle: 0,
        velocityX: Math.random() - 0.5,
        velocityY: Math.random() - 0.5,
        rotationSpeed: Math.random() - 0.5,
      });
    });
  });

  // Switch each character to use absolute positioning
  explodeStates.forEach((explodeState) => {
    explodeState.element.style.position = "absolute";
    explodeState.element.style.top = `${explodeState.top}px`;
    explodeState.element.style.left = `${explodeState.left}px`;
  });
}

window.addEventListener("resize", initialize);

initialize();

// Keep the selection state up to date
let selectionString = "";
document.addEventListener("selectionchange", () => {
  const selection = window.getSelection();
  selectionString = selection.toString();

  explodeStates.forEach((explodeState) => {
    explodeState.selected = selection.containsNode(
      explodeState.element,
      explodeState.element !== selection.focusNode &&
        explodeState.element !== selection.anchorNode,
    );
  });
});

function animate() {
  explodeStates.forEach((explodeState) => {
    const {
      selected,
      exploding,
      element,
      x,
      y,
      angle,
      velocityX,
      velocityY,
      rotationSpeed,
    } = explodeState;

    if (selectionString.length > 0 && selected) {
      if (exploding) {
        explodeState.x += maxDepartVelocity * velocityX;
        explodeState.y += maxDepartVelocity * velocityY;
        explodeState.angle += maxDepartVelocity * rotationSpeed;
      } else {
        setTimeout(() => {
          explodeState.exploding = true;
        }, explosionDelayMs);
      }
    } else {
      if (
        (velocityX > 0 && x > velocityX) ||
        (velocityX < 0 && x < velocityX)
      ) {
        explodeState.x -= maxReturnVelocity * velocityX;
      } else {
        explodeState.x = 0;
      }

      if (
        (velocityY > 0 && y > velocityY) ||
        (velocityY < 0 && y < velocityY)
      ) {
        explodeState.y -= maxReturnVelocity * velocityY;
      } else {
        explodeState.y = 0;
      }

      if (
        (rotationSpeed > 0 && angle > 0) ||
        (rotationSpeed < 0 && angle < 0)
      ) {
        explodeState.angle -= maxReturnVelocity * rotationSpeed;
      } else {
        explodeState.angle = 0;
      }
    }

    if (exploding && explodeState.x === 0 && explodeState.y === 0) {
      explodeState.exploding = false;
    }

    element.style.transform = `translate(${explodeState.x}px, ${explodeState.y}px) rotate(${explodeState.angle}deg)`;
  });

  requestAnimationFrame(animate);
}

animate();
