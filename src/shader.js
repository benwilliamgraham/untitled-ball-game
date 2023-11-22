"use strict";

class ShaderProgram {
  constructor(gl, vertexShaderSource, fragmentShaderSource, attribs, uniforms) {
    function compileShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(
          `Error compiling shader: ` + gl.getShaderInfoLog(shader)
        );
      }
      return shader;
    }

    // Compile shaders
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    // Create shader program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("Error linking program" + gl.getProgramInfoLog(program));
    }

    this.program = program;

    // Get attribute locations
    this.attribs = {};
    for (const attrib of attribs) {
      this.attribs[attrib] = gl.getAttribLocation(program, attrib);
    }

    // Get uniform locations
    this.uniforms = {};
    for (const uniform of uniforms) {
      this.uniforms[uniform] = gl.getUniformLocation(program, uniform);
    }
  }

  static async fromFiles(
    gl,
    vertexShaderUrl,
    fragmentShaderUrl,
    attribs,
    uniforms
  ) {
    const vertexShaderSource = await fetch(vertexShaderUrl).then((res) =>
      res.text()
    );
    const fragmentShaderSource = await fetch(fragmentShaderUrl).then((res) =>
      res.text()
    );
    return new ShaderProgram(
      gl,
      vertexShaderSource,
      fragmentShaderSource,
      attribs,
      uniforms
    );
  }
}

export default ShaderProgram;
