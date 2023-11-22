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
      ["uModelMat", "uViewMat", "uDepth"]
    );

    // Create buffers
    // 2---3
    // |   |
    // 0---1
    const vertices = [
      // 0
      0, 0,
      // 2
      0, 1,
      // 3
      1, 1,
      // 0
      0, 0,
      // 3
      1, 1,
      // 1
      1, 0,
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

  
  render(camera, scene) {
    const { gl, spriteProgram, viewProgram, spriteBuffer } = this;

    // Clear screen
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);

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

    // Set camera uniforms
    gl.uniformMatrix3fv(spriteProgram.uniforms.uViewMat, false, camera.viewMat);

    // Render sprites
    for (const sprite of scene.sprites) {
      // Set sprite uniforms
      gl.uniformMatrix3fv(
        spriteProgram.uniforms.uModelMat,
        false,
        sprite.modelMat
      );
      gl.uniform1f(spriteProgram.uniforms.uDepth, sprite.depth);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sprite.texture.id);
      gl.uniform1i(spriteProgram.uniforms.uTexture, 0);

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, spriteBuffer.numVertices);
    }
  }
}

export default Renderer;