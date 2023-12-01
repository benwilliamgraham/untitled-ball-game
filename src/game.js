"use strict";

import Renderer from "./renderer.js"
import Scene from "./scene.js"
import Sprite from "./sprite.js"
import Ball from "./ball.js"

class Game {
  constructor(canvas, renderer) {
    this.canvas = canvas;
    this.renderer = renderer;

    this.scene = new Scene(renderer);

    this.scene.sprites.add(new Ball(100, 10, 10, 0, renderer.getTexture("src/textures/a.png")));
  }

  static async init(canvas) {
    const renderer = await Renderer.init(canvas);
    return new Game(canvas, renderer);
  }

  play() {
    const {renderer, scene} = this;

    let lastTime = 0;
    function gameLoop(time) {
      const dt = (time - lastTime) % 1000; // Prevents delta time from getting too large
      lastTime = time;

      scene.update(dt);

      renderer.render(scene);

      requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
  }
}

export default Game;