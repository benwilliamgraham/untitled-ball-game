"use strict";

import ShaderProgram from "./shader.js";
import Buffer from "./buffer.js";
import Texture from "./texture.js";

class Renderer {
  constructor(
    canvas,
    gl,
    spriteProgram,
    spriteBuffer
  ) {
    this.canvas = canvas;
    this.gl = gl;
    this.spriteProgram = spriteProgram;
    this.spriteBuffer = spriteBuffer;
    this.textures = {};
  }

  static async init(canvas) {
    // Get WebGL context
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      throw new Error("WebGL not supported");
    }

    // Create shader programs
    const spriteProgram = await ShaderProgram.fromFiles(
      gl,
      "src/shaders/sprite.vert",
      "src/shaders/sprite.frag",
      ["aPos"],
      ["uResolution", "uDimensions", "uPosition", "uRotation", "uTexture"]
    );

    // Create buffers
    // 2---3
    // |   |
    // 0---1
    const vertices = [
      // 0
      -0.5, -0.5,
      // 2
      -0.5, 0.5,
      // 3
      0.5, 0.5,
      // 0
      -0.5, -0.5,
      // 3
      0.5, 0.5,
      // 1
      0.5, -0.5,
    ];
    const spriteBuffer = new Buffer(gl, vertices);

    return new Renderer(
      canvas,
      gl,
      spriteProgram,
      spriteBuffer,
    );
  }

  getTexture(url) {
    if (this.textures[url]) {
      return this.textures[url];
    }

    const texture = new Texture(this.gl, url);
    this.textures[url] = texture;
    return texture;
  }

  
  render(scene) {
    const { gl, spriteProgram, spriteBuffer } = this;

    // Clear screen
    gl.clearColor(179 / 255, 158 / 255, 127 / 255, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Use sprite program
    gl.useProgram(spriteProgram.program);

    // Bind sprite buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, spriteBuffer.vertexBuffer);
    gl.enableVertexAttribArray(spriteProgram.attribs.aPos);
    gl.vertexAttribPointer(
      spriteProgram.attribs.aPos,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );

    // Set resolution uniform
    gl.uniform2f(
      spriteProgram.uniforms.uResolution,
      this.canvas.width,
      this.canvas.height
    );

    // Render sprites
    for (const sprite of scene.sprites) {
      // Set sprite uniforms
      gl.uniform2f(spriteProgram.uniforms.uDimensions, sprite.width, sprite.height);
      gl.uniform2f(spriteProgram.uniforms.uPosition, sprite.x, sprite.y);
      gl.uniform1f(spriteProgram.uniforms.uRotation, sprite.rot);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sprite.texture.id);
      gl.uniform1i(spriteProgram.uniforms.uTexture, 0);

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, spriteBuffer.numVertices);
    }
  }
}

export default Renderer;
