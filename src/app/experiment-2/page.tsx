'use client';

import { useEffect, useRef } from 'react';

export default function Experiment2() {
    const ref = useRef<HTMLCanvasElement>(null);

    const resizeCanvas = (
        canvas: HTMLCanvasElement,
        gl: WebGL2RenderingContext
    ) => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    };

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) {
            return;
        }

        const gl = ref.current?.getContext('webgl2');
        if (!gl) {
            return;
        }

        resizeCanvas(canvas, gl);

        function onWindowResize(
            canvas: HTMLCanvasElement,
            gl: WebGL2RenderingContext
        ) {
            resizeCanvas(canvas, gl);
        }

        window.addEventListener(
            'resize',
            onWindowResize.bind(null, canvas, gl)
        );

        const program = gl.createProgram();
        if (!program) {
            return;
        }

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        if (!vertexShader) {
            return;
        }
        gl.shaderSource(
            vertexShader,
            `#version 300 es
        in vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
            gl_PointSize = 10.0;
        }`
        );
        gl.compileShader(vertexShader);
        gl.attachShader(program, vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fragmentShader) {
            return;
        }
        gl.shaderSource(
            fragmentShader,
            `#version 300 es
        precision mediump float;
        out vec4 outColor;
        void main() {
            outColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`
        );
        gl.compileShader(fragmentShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const vertexShaderInfo = `${gl.getShaderInfoLog(vertexShader)}`;
            const fragmentShaderInfo = `${gl.getShaderInfoLog(fragmentShader)}`;
            const programInfo = `${gl.getProgramInfoLog(program)}`;
            throw new Error(`
            Vertex: ${vertexShaderInfo}
            Fragment: ${fragmentShaderInfo}
            Program: ${programInfo}
            `);
        }

        const vertexArray = gl.createVertexArray();
        gl.bindVertexArray(vertexArray);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([0.5, 0.5]),
            gl.STATIC_DRAW
        );

        gl.useProgram(program);
        gl.bindVertexArray(vertexArray);

        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.POINTS, 0, 1);

        return () => {
            window.removeEventListener(
                'resize',
                onWindowResize.bind(null, canvas, gl)
            );
        };
    });

    return (
        <canvas
            ref={ref}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
            }}
        />
    );
}
