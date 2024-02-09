import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useFrame } from '../hooks/useFrame';

const vertexShaderSource = `
    precision mediump float;
    attribute vec2 vertPosition;
    varying vec2 vertFragPosition;

    void main() {
        vertFragPosition = vertPosition;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`;
const fragmentShaderSource = `
    precision mediump float;
    varying vec2 vertFragPosition;
    uniform float u_time;

    // https://thebookofshaders.com/10/
    float rand(vec2 co){
        return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
        gl_FragColor.r = rand(vertFragPosition * u_time * 1.0);
        gl_FragColor.g = rand(vertFragPosition * u_time * 2.0);
        gl_FragColor.b = rand(vertFragPosition * u_time * 3.0);
        gl_FragColor.a = rand(vertFragPosition * u_time) * 0.2;
    }
`;

export default function Experiment1() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentHeight, setCurrentHeight] = useState<number>();
  const [currentWidth, setCurrentWidth] = useState<number>();

  const [program, setProgram] = useState<WebGLProgram>();
  function update(gl: WebGL2RenderingContext, width: number, height: number) {
    if (program == null) {
      return;
    }

    const triangleVertices = [
      // x, y
      -1.0, 1.0, -1.0, -1.0, 1, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    ];
    const triangleVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(triangleVertices),
      gl.STATIC_DRAW
    );

    const vertPositionAttributeLocation = gl.getAttribLocation(
      program,
      'vertPosition'
    );
    gl.vertexAttribPointer(
      vertPositionAttributeLocation,
      2,
      gl.FLOAT,
      false,
      2 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    gl.enableVertexAttribArray(vertPositionAttributeLocation);

    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
    const timeNormalized = Date.now() / 1000 - Math.floor(Date.now() / 1000);
    gl.uniform1f(timeUniformLocation, timeNormalized);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  useFrame(
    () => {
      const context = canvasRef.current?.getContext('webgl2');
      if (context != null && currentWidth != null && currentHeight != null) {
        update(context, currentWidth, currentHeight);
      }
    },
    1000 / 30,
    [update]
  );

  function setDimensions() {
    const boundingBox = canvasRef.current?.getBoundingClientRect();
    const gl = canvasRef.current?.getContext('webgl2');
    if (boundingBox == null || gl == null) {
      return;
    }

    setCurrentHeight(boundingBox.height);
    setCurrentWidth(boundingBox.width);
    gl.viewport(0, 0, boundingBox.width, boundingBox.height);
  }

  useLayoutEffect(() => {
    setDimensions();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', setDimensions);
    return () => {
      window.removeEventListener('resize', setDimensions);
    };
  }, []);

  useEffect(() => {
    const gl = canvasRef.current?.getContext('webgl2');
    if (gl == null) {
      return;
    }

    // vertex shader
    const glVertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (glVertexShader == null) {
      return;
    }
    gl.shaderSource(glVertexShader, vertexShaderSource);
    gl.compileShader(glVertexShader);
    if (!gl.getShaderParameter(glVertexShader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(glVertexShader);
      throw `Could not compile WebGL vertex shader. \n\n${info}`;
    }

    // fragment shader
    const glFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (glFragmentShader == null) {
      return;
    }
    gl.shaderSource(glFragmentShader, fragmentShaderSource);
    gl.compileShader(glFragmentShader);
    if (!gl.getShaderParameter(glFragmentShader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(glFragmentShader);
      throw `Could not compile WebGL fragment shader. \n\n${info}`;
    }

    // program
    const program = gl.createProgram();
    if (program == null) {
      return;
    }
    gl.attachShader(program, glVertexShader);
    gl.attachShader(program, glFragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      throw `Could not compile WebGL program. \n\n${info}`;
    }
    gl.useProgram(program);
    setProgram(program);

    return () => {
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      height={currentHeight}
      ref={canvasRef}
      style={{
        height: '100%',
        width: '100%',
      }}
      width={currentWidth}
    ></canvas>
  );
}
