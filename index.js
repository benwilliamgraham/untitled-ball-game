const gameWidth = 600;
const gameHeight = 800;

async function main() {
  // Create render canvas
  const canvas = document.createElement("canvas");
  canvas.width = gameWidth;
  canvas.height = gameHeight;
  document.body.appendChild(canvas);

  // Create gl context
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    throw new Error("WebGL2 not supported");
  }

  let lastTime = 0;
  function gameLoop(time) {
    const dt = (time - lastTime) % 1000; // Prevents delta time from getting too large
    lastTime = time;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}

main();
