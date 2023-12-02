"use strict";

import Renderer from "./renderer.js";
import Scene from "./scene.js";
import Sprite from "./sprite.js";
import Ball from "./ball.js";

class Game {
  constructor(canvas, renderer) {
    this.canvas = canvas;
    this.renderer = renderer;

    this.scene = new Scene(renderer);

    this.balls = new Set();

    const ball = new Ball(
      100,
      100,
      500,
      0,
      renderer.getTexture("src/textures/a.png")
    );
    this.balls.add(ball);
    this.scene.sprites.add(ball);
  }

  static async init(canvas) {
    const renderer = await Renderer.init(canvas);
    return new Game(canvas, renderer);
  }

  play() {
    const { canvas, renderer, scene, balls} = this;

      function updatePhysics(dt) {
        for (const ball of balls) {
          ball.velY -= 0.001 * dt;
    
          ball.x += ball.velX * dt;
          ball.y += ball.velY * dt;
        }
        const dampening = 0.7;
        for (const ball of balls) {
          // Check if the ball has left the bounds of the screen
          if (ball.y - ball.radius < 10) {
            ball.y = 10 + ball.radius;
            ball.velY = -ball.velY * dampening;
          }
          if (ball.x - ball.radius < 0) {
            ball.x = 10 + ball.radius;
            ball.velX = -ball.velX * dampening;
          }
          if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.velX = -ball.velX * dampening;
          }
        }
      }

      let lastTime = 0,
      accumulator = 0;
    function gameLoop(time) {
      const dt = (time - lastTime) % 1000; // Prevents delta time from getting too large
      lastTime = time;
      accumulator += dt;

      // Apply physics
      const step = 1 / 60;
      while (accumulator > step) {
        updatePhysics(step);

        accumulator -= step;
      }

      // Render scene
      renderer.render(scene);

      // Request next frame
      requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
  }
}

export default Game;
