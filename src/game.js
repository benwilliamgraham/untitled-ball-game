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
  }

  static async init(canvas) {
    const renderer = await Renderer.init(canvas);
    return new Game(canvas, renderer);
  }

  play() {
    const { canvas, renderer, scene, balls } = this;

    // Setup input
    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const ball = new Ball(
        Math.floor(Math.random() * 11),
        x,
        canvas.height - y,
        renderer
      );
      balls.add(ball);
      scene.sprites.add(ball);
    }
    );

    // Create physics loop
    function updatePhysics(dt) {
      const restitution = 0.7;
      
      // Apply gravity and update position
      for (const ball of balls) {
        ball.velY -= 0.001 * dt;

        ball.x += ball.velX * dt;
        ball.y += ball.velY * dt;
      }
      
      // Check for collisions with the floor and walls
      for (const ball of balls) {
        // Check if the ball has left the bounds of the screen
        if (ball.y - ball.radius < 10) {
          ball.y = 10 + ball.radius;
          ball.velY = -ball.velY * restitution;
        }
        if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.velX = -ball.velX * restitution;
        }
        if (ball.x + ball.radius > canvas.width) {
          ball.x = canvas.width - ball.radius;
          ball.velX = -ball.velX * restitution;
        }
      }

      // Create list of colliding balls
      const collidingBalls = [];
      const ballsArr = Array.from(balls);
      for (let i = 0; i < balls.size; i++) {
        const ball = ballsArr[i];
        for (let j = i + 1; j < balls.size; j++) {
          const otherBall = ballsArr[j];

          const dx = ball.x - otherBall.x;
          const dy = ball.y - otherBall.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < ball.radius + otherBall.radius) {
            collidingBalls.push([ball, otherBall]);
          }
        }
      }

      // Resolve collisions
      for (const [a, b] of collidingBalls) {
        // Calculate the normal vector
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const normalX = dx / distance;
        const normalY = dy / distance;

        // Separate the balls
        const overlap = (a.radius + b.radius) - distance;

        a.x -= overlap * normalX * 0.5;
        a.y -= overlap * normalY * 0.5;
        b.x += overlap * normalX * 0.5;
        b.y += overlap * normalY * 0.5;

        // Calculate the relative velocity
        const relVelX = b.velX - a.velX;
        const relVelY = b.velY - a.velY;

        // Calculate the relative velocity in terms of the normal direction
        const normalVel = relVelX * normalX + relVelY * normalY;

        // Do not resolve if velocities are separating
        if (normalVel > 0) {
          continue;
        }

        // Calculate impulse scalar
        let impulseScalar = -(1 + restitution) * normalVel;
        impulseScalar /= 1 / a.mass + 1 / b.mass;

        // Apply impulse
        const impulseX = impulseScalar * normalX;
        const impulseY = impulseScalar * normalY;

        a.velX -= 1 / a.mass * impulseX;
        a.velY -= 1 / a.mass * impulseY;
        b.velX += 1 / b.mass * impulseX;
        b.velY += 1 / b.mass * impulseY;
      }
    }

    let lastTime = 0,
      accumulator = 0;
    function gameLoop(time) {
      const dt = (time - lastTime) % 1000; // Prevents delta time from getting too large
      lastTime = time;
      accumulator += dt;

      // Apply physics
      const step = 1000 / 256;
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
