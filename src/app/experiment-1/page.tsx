'use client';

import { useEffect, useRef } from 'react';

const vertexShader = `#version 300 es
in vec2 a_position;
uniform float u_time;

out vec4 v_color;

// https://thebookofshaders.com/10/
float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  // Multiply the position by the matrix.
  gl_Position = vec4(a_position.x, a_position.y + sin(rand(a_position.xy) * u_time) / 2.0, 0, 1);
  gl_PointSize = 4.0 * rand(a_position);

  // Convert from clipspace to colorspace.
  // Clipspace goes -1.0 to +1.0
  // Colorspace goes from 0.0 to 1.0
  v_color = gl_Position * 0.5 + 0.5;
}
`;

const fragmentShader = `#version 300 es

precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
  outColor = v_color;
}
`;

export default function Experiment1() {
    const ref = useRef<HTMLCanvasElement>(null);
    const start = useRef(Date.now());

    useEffect(() => {
        if (ref.current == null) {
            console.error('HTMLCanvasElement is null');
            return;
        }

        const gl = ref.current.getContext('webgl2')!;

        const program = gl.createProgram()!;

        // create vertex shader
        const glVertexShader = gl.createShader(gl.VERTEX_SHADER)!;
        gl.shaderSource(glVertexShader, vertexShader);
        gl.compileShader(glVertexShader);
        gl.attachShader(program, glVertexShader);

        // create fragment shader
        const glFragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(glFragmentShader, fragmentShader);
        gl.compileShader(glFragmentShader);
        gl.attachShader(program, glFragmentShader);

        // link program
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(program);
            throw `Could not compile WebGL program. \n\n${info}`;
        }

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // get location in program for our defined 'in vec2 a_position'
        const positionLocation = gl.getAttribLocation(program, 'a_position');

        // draw
        // size canvas drawing buffer to its actual size
        ref.current.width = ref.current.clientWidth;
        ref.current.height = ref.current.clientHeight;
        // ...and change gl viewport
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // setup for position attribute
        // creates a buffer
        const buffer = gl.createBuffer();
        // we bind our created buffer to the gl.ARRAY_BUFFER
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        // we add out data to that same buffer - bufferData(target, data, usage)
        const floats = new Float32Array(gl.canvas.width * 2);
        for (let i = 0; i < gl.canvas.width * 2; i += 2) {
            floats[i] = (i / 2 / gl.canvas.width) * 2 - 1;
            floats[i + 1] = Math.sin(i / 2) / 2;
        }
        gl.bufferData(gl.ARRAY_BUFFER, floats, gl.STATIC_DRAW);

        // describe the layout of that buffer
        // (index, dataPoints, type, normalized, stride, offeset)
        // index - location of our defined 'in vec2 a_position'
        // dataPoints - how many total 'groups' of points (i.e. 2 sets of 3point triangle vertices)
        // normalized - cf. https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer#normalized
        // stride - 0 means each set is next to each other, any other positive value would have 'gaps' between them
        // offset - starting point in
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        // enable the vertex
        gl.enableVertexAttribArray(positionLocation);

        const u_timeLocation = gl.getUniformLocation(program, 'u_time');
        gl.uniform1f(u_timeLocation, (Date.now() - start.current) / 1000);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Draw the geometry.
        gl.drawArrays(gl.POINTS, 0, gl.canvas.width);

        let frame = 0;
        const update = () => {
            const now = Date.now();
            const delta = (now - start.current) / 1000;

            gl.uniform1f(u_timeLocation, delta);

            // Clear the canvas
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Draw the geometry.
            gl.drawArrays(gl.POINTS, 0, gl.canvas.width);

            frame = requestAnimationFrame(update);
        };
        frame = requestAnimationFrame(update);

        return () => {
            console.log('cleanup');
            gl.deleteProgram(program);
            cancelAnimationFrame(frame);
        };
    });

    return (
        <canvas
            ref={ref}
            style={{
                height: '100%',
                left: '0',
                top: '0',
                position: 'fixed',
                width: '100%',
                zIndex: '10',
            }}
        />
    );
}
