const explodeStates = new Map();
const explodeContainers = document.querySelectorAll(".explode");
explodeContainers.forEach((explodeContainer) => {
  const text = explodeContainer.textContent.trim();

  explodeContainer.replaceChildren(
    ...text.split("").map((character) => {
      const span = document.createElement("span");
      span.className = "explodable";
      span.textContent = character;
      return span;
    }),
  );
  const ghostElement = document.createElement("span");
  ghostElement.textContent = text;
  ghostElement.style.opacity = 0;
  ghostElement.style.pointerEvents = "none";
  explodeContainer.appendChild(ghostElement);

  const containerRect = explodeContainer.getBoundingClientRect();
  explodeContainer.querySelectorAll(".explodable").forEach((explodable) => {
    const rect = explodable.getBoundingClientRect();
    explodeStates.set(explodable, {
      exploding: false,
      x: 0,
      y: 0,
      initialX: 0,
      initialY: 0,
      top: rect.top - containerRect.top,
      left: rect.left - containerRect.left,
      angle: 0,
      velocityX: Math.random() - 0.5,
      velocityY: Math.random() - 0.5,
      rotationSpeed: Math.random() - 0.5,
    });
  });
});

const explodables = document.querySelectorAll(".explodable");

const maxDepartVelocity = 0.5;
const maxReturnVelocity = 5;

explodables.forEach((element) => {
  const explodeState = explodeStates.get(element);
  element.style.position = "absolute";
  element.style.top = `${explodeState.top}px`;
  element.style.left = `${explodeState.left}px`;
});

const selectionStates = new Map();

function animate() {
  const selection = window.getSelection();
  const selectionString = selection.toString();

  explodables.forEach((element) => {
    selectionStates.set(
      element,
      selection.containsNode(
        element,
        element !== selection.focusNode && element !== selection.anchorNode,
      ),
    );
  });

  explodables.forEach((element) => {
    const explodeState = explodeStates.get(element);

    let x = explodeState.x;
    let y = explodeState.y;

    if (selectionString.length > 0 && selectionStates.get(element)) {
      if (explodeState.exploding) {
        x += maxDepartVelocity * explodeState.velocityX;
        y += maxDepartVelocity * explodeState.velocityY;
        explodeState.angle += maxDepartVelocity * explodeState.rotationSpeed;
      } else {
        setTimeout(() => {
          explodeState.exploding = true;
        }, 10);
      }
    } else {
      const dx = x - explodeState.initialX;
      if (
        (explodeState.velocityX > 0 && dx > explodeState.velocityX) ||
        (explodeState.velocityX < 0 && dx < explodeState.velocityX)
      ) {
        x -= maxReturnVelocity * explodeState.velocityX;
      } else {
        x = explodeState.initialX;
      }

      const dy = y - explodeState.initialY;
      if (
        (explodeState.velocityY > 0 && dy > explodeState.velocityY) ||
        (explodeState.velocityY < 0 && dy < explodeState.velocityY)
      ) {
        y -= maxReturnVelocity * explodeState.velocityY;
      } else {
        y = explodeState.initialY;
      }

      if (
        (explodeState.rotationSpeed > 0 && explodeState.angle > 0) ||
        (explodeState.rotationSpeed < 0 && explodeState.angle < 0)
      ) {
        explodeState.angle -= maxReturnVelocity * explodeState.rotationSpeed;
      } else {
        explodeState.angle = 0;
      }
    }

    if (
      explodeState.exploding &&
      x === explodeState.initialX &&
      y === explodeState.initialY
    ) {
      explodeState.exploding = false;
    }

    explodeState.x = x;
    explodeState.y = y;

    element.style.setProperty("--x", `${x}px`);
    element.style.setProperty("--y", `${y}px`);
    element.style.setProperty("--angle", `${explodeState.angle}deg`);
  });

  requestAnimationFrame(animate);
}

animate();
