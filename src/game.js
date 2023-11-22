"use strict";

class Game {
  constructor(canvas, renderer) {
    this.canvas = canvas;
    this.renderer = renderer;

    this.camera = new Camera(0, 0, 0, canvas.width, canvas.height);

    this.scene = new TestScene(renderer);
  }

  static async init(canvas) {
    const renderer = await Renderer.init(canvas);
    return new Game(canvas, renderer);
  }

  play() {
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
}
