"use strict";

import Renderer from "./renderer.js";
import Scene from "./scene.js";
import Sprite from "./sprite.js";
import Ball from "./ball.js";
import Particle from "./particle.js";

class Game {
  constructor(canvas, scoreboard, nextBallImg, renderer) {
    this.canvas = canvas;
    this.scoreboard = scoreboard;
    this.nextBallImg = nextBallImg;
    this.renderer = renderer;

    this.scene = new Scene(renderer);

    this.balls = new Set();
    this.particles = new Set();
  }

  static async init(canvas, scoreboard, nextBallImg) {
    const renderer = await Renderer.init(canvas);
    return new Game(canvas, scoreboard, nextBallImg, renderer);
  }

  play() {
    const { canvas, scoreboard, nextBallImg, renderer, scene, balls, particles } = this;

    // Create score
    let score = 0;

    // Create floor
    const floorHeight = 20;
    const floor = new Sprite(
      canvas.width,
      floorHeight,
      canvas.width / 2,
      floorHeight / 2,
      0,
      renderer.getTexture("src/textures/solid.png")
    );
    scene.sprites.add(floor);

    // Create upper bound
    const upperBoundHeight = canvas.height - 60;
    const upperBound = new Sprite(
      canvas.width,
      6,
      canvas.width / 2,
      upperBoundHeight,
      0,
      renderer.getTexture("src/textures/bound.png")
    );
    scene.sprites.add(upperBound);

    // Create ball hierarchy
    const levelHeirarchy = [
      { radius: 30, texture: renderer.getTexture("src/textures/0.png") },
      { radius: 40, texture: renderer.getTexture("src/textures/1.png") },
      { radius: 50, texture: renderer.getTexture("src/textures/2.png") },
      { radius: 60, texture: renderer.getTexture("src/textures/3.png") },
      { radius: 70, texture: renderer.getTexture("src/textures/4.png") },
      { radius: 80, texture: renderer.getTexture("src/textures/5.png") },
      { radius: 90, texture: renderer.getTexture("src/textures/6.png") },
      { radius: 100, texture: renderer.getTexture("src/textures/7.png") },
      { radius: 110, texture: renderer.getTexture("src/textures/8.png") },
      { radius: 120, texture: renderer.getTexture("src/textures/9.png") },
      { radius: 130, texture: renderer.getTexture("src/textures/10.png") },
    ];

    // Create particle texture
    const particleTexture = renderer.getTexture("src/textures/0.png");

    // Create dropper ball
    let nextBall;
    
    function createNextBall() {
      const level = Math.floor(Math.random() * 6);
      nextBall = new Ball(
        level,
        levelHeirarchy[level].radius,
        canvas.width / 2,
        canvas.height + levelHeirarchy[level].radius,
        levelHeirarchy[level].texture
      );
      nextBallImg.src = levelHeirarchy[level].texture.src;
    }
    createNextBall();

    // Setup input
    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;

      nextBall.x = x;
      scene.sprites.add(nextBall);
      balls.add(nextBall);
      nextBall = null;

      createNextBall();
    });

    // Create physics loop
    function updatePhysics(dt) {
      const restitution = 0.4;
      const gravity = 0.001;

      // Apply gravity and update position
      for (const ball of balls) {
        ball.velY -= gravity * dt;

        ball.x += ball.velX * dt;
        ball.y += ball.velY * dt;
      }

      // Check for collisions with the floor and walls
      for (const ball of balls) {
        // Check if the ball has left the bounds of the screen
        if (ball.y - ball.radius < floorHeight) {
          ball.y = floorHeight + ball.radius;
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
            if (ball.level === otherBall.level && ball.level < levelHeirarchy.length - 1) {
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

        a.x -= overlap * normalX * 0.4;
        a.y -= overlap * normalY * 0.4;
        b.x += overlap * normalX * 0.4;
        b.y += overlap * normalY * 0.4;

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
        const level = Math.min(a.level + 1, levelHeirarchy.length - 1);
        const x = (a.x + b.x) / 2;
        const y = (a.y + b.y) / 2;

        const combinedVelX = (a.velX * a.mass + b.velX * b.mass) / (a.mass + b.mass);
        const combinedVelY = (a.velY * a.mass + b.velY * b.mass) / (a.mass + b.mass);

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
        ball.velX = combinedVelX;
        ball.velY = combinedVelY;
        balls.add(ball);
        scene.sprites.add(ball);

        // Create particles
        for (let i = 0; i < (a.radius + b.radius) / 5; i++) {
          const particle = new Particle(
            x,
            y,
            particleTexture
          );
          const direction = Math.random() * Math.PI * 2;
          const magnitude = Math.random() * 0.3 + 0.3;
          particle.velX = Math.cos(direction) * magnitude;
          particle.velY = Math.sin(direction) * magnitude;
          scene.sprites.add(particle);
          particles.add(particle);
        }

        // Update score
        score += 3 * (level + 1);

        // Update scoreboard
        scoreboard.innerText = "Score: " + score;
      }

      // Update particles
      const particlesToRemove = [];
      for (const particle of particles) {
        particle.velY -= gravity * dt;

        particle.x += particle.velX * dt;
        particle.y += particle.velY * dt;

        if (particle.y + particle.radius < 0) {
          particlesToRemove.push(particle);
        }
      }

      // Remove particles
      for (const particle of particlesToRemove) {
        scene.sprites.delete(particle);
        particles.delete(particle);
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
