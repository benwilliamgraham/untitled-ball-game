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

    // Create ball hierarchy
    const levelHeirarchy = [
      { radius: 20, texture: renderer.getTexture("src/textures/0.png") },
      { radius: 25, texture: renderer.getTexture("src/textures/1.png") },
      { radius: 30, texture: renderer.getTexture("src/textures/2.png") },
      { radius: 35, texture: renderer.getTexture("src/textures/3.png") },
      { radius: 40, texture: renderer.getTexture("src/textures/4.png") },
      { radius: 45, texture: renderer.getTexture("src/textures/5.png") },
      { radius: 50, texture: renderer.getTexture("src/textures/6.png") },
      { radius: 55, texture: renderer.getTexture("src/textures/7.png") },
      { radius: 60, texture: renderer.getTexture("src/textures/8.png") },
      { radius: 65, texture: renderer.getTexture("src/textures/9.png") },
      { radius: 70, texture: renderer.getTexture("src/textures/10.png") },
    ];

    // Setup input
    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const level = Math.floor(Math.random() * 11);
      const ball = new Ball(
        level,
        levelHeirarchy[level].radius,
        x,
        canvas.height - y,
        levelHeirarchy[level].texture
      );
      balls.add(ball);
      scene.sprites.add(ball);
    });

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

      // Create list of colliding balls and combined balls
      const collidingBalls = [];
      const combinedBalls = [];
      const ballsArr = Array.from(balls);
      for (let i = 0; i < balls.size; i++) {
        const ball = ballsArr[i];
        for (let j = i + 1; j < balls.size; j++) {
          const otherBall = ballsArr[j];

          const dx = ball.x - otherBall.x;
          const dy = ball.y - otherBall.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < ball.radius + otherBall.radius) {
            if (ball.level === otherBall.level) {
              combinedBalls.push([ball, otherBall]);
            } else {
              collidingBalls.push([ball, otherBall]);
            }
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
        const overlap = a.radius + b.radius - distance;

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

        a.velX -= (1 / a.mass) * impulseX;
        a.velY -= (1 / a.mass) * impulseY;
        b.velX += (1 / b.mass) * impulseX;
        b.velY += (1 / b.mass) * impulseY;
      }

      // Combine balls
      for (const [a, b] of combinedBalls) {
        const level = Math.min(a.level + 1, 10);
        const x = (a.x + b.x) / 2;
        const y = (a.y + b.y) / 2;

        balls.delete(a);
        balls.delete(b);
        scene.sprites.delete(a);
        scene.sprites.delete(b);

        const ball = new Ball(
          level,
          levelHeirarchy[level].radius,
          x,
          y,
          levelHeirarchy[level].texture
        );
        balls.add(ball);
        scene.sprites.add(ball);
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
