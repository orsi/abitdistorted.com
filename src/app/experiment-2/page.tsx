'use client';

import { useEffect, useRef, useState } from 'react';
import { clear, createCanvas, draw, resize } from '../../hooks/useWebGL';

export default function Experiment2() {
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement>();

  useEffect(() => {
    const { canvas, gl, program } = createCanvas('experiment-2', {
      vertexShader: `#version 300 es
              in vec2 position;
              void main() {
                  gl_Position = vec4(position, 0.0, 1.0);
                  gl_PointSize = 10.0;
              }`,
      fragmentShader: `#version 300 es
              precision mediump float;
              out vec4 outColor;
              void main() {
                  outColor = vec4(1.0, 1.0, 0.0, 1.0);
              }`,
    });

    setCanvasEl(canvas);

    const vertexArray = gl.createVertexArray();
    gl.bindVertexArray(vertexArray);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0.5, 0.5]),
      gl.STATIC_DRAW
    );

    gl.bindVertexArray(vertexArray);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    clear(gl, { clearColor: { r: 1 } });
    draw(gl, {
      drawMode: 'points',
      drawCount: 1,
    });

    // setup resize
    resize(gl, window.innerWidth, window.innerHeight);

    function onWindowResize(e: Event) {
      resize(gl!, window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  });

  return (
    <div
      ref={(ref) => {
        if (ref && canvasEl) {
          ref.appendChild(canvasEl);
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    ></div>
  );
}
