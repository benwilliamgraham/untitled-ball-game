"use strict";

class Buffer {
  constructor(gl, vertices, drawType = gl.STATIC_DRAW) {
    this.vertexBuffer = gl.createBuffer();
    this.update(gl, vertices);
  }

  update(gl, vertices) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    this.numVertices = vertices.length / 2;
  }
}

export default Buffer;
