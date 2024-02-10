import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export default function Experiment1() {
    const vertexShaderSource = `
        precision mediump float;
        attribute vec2 vertPosition;

        void main() {
            gl_Position = vec4(vertPosition, 0.0, 1.0);
        }`;
    const fragmentShaderSource = `
        precision mediump float;
        uniform vec2 u_mousePosition;
        uniform float u_time;

        #define X_RANGE 20.0
        #define Y_RANGE 25.0

        // https://thebookofshaders.com/10/
        float rand(vec2 co){
            return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
            float modifier = 0.2;
            float randXLeft = rand(u_mousePosition * u_time) * 10.0;
            float randXRight = rand(u_mousePosition * u_time) * 2.0;
            float randYTop = rand(u_mousePosition * u_time) * 8.0;
            float randYBottom = rand(u_mousePosition * u_time) * 4.0;
            bool isInDistance = (u_mousePosition.x - X_RANGE + randXLeft < gl_FragCoord.x
                && u_mousePosition.x + X_RANGE + randXRight > gl_FragCoord.x)
            || (u_mousePosition.y - Y_RANGE + randYTop < gl_FragCoord.y
                && u_mousePosition.y + Y_RANGE + randYBottom > gl_FragCoord.y);
            if (isInDistance) {
                modifier += rand(vec2(u_time, u_time)) * .1;
            }

            gl_FragColor.r = rand(gl_FragCoord.xy * u_time * 1.0 * modifier);
            gl_FragColor.g = rand(gl_FragCoord.xy * u_time * 2.0 * modifier);
            gl_FragColor.b = rand(gl_FragCoord.xy * u_time * 3.0 * modifier);
            gl_FragColor.a = rand(gl_FragCoord.xy * u_time) * modifier;
        }`;

    const startTimeRef = useRef(Date.now());
    const lastUpdateRef = useRef(startTimeRef.current);
    const prefersReducedMotionRef = useRef(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef<MouseEvent>();

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const gl = canvasRef.current?.getContext('webgl2');
        if (gl == null) {
            return;
        }

        // setup gl
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        function setDimensions() {
            if (!canvasRef.current || !gl) {
                return;
            }

            canvasRef.current.width = canvasRef.current.clientWidth;
            canvasRef.current.height = canvasRef.current.clientHeight;
            gl!.viewport(
                0,
                0,
                canvasRef.current!.clientWidth!,
                canvasRef.current!.clientHeight!
            );
        }
        setDimensions();

        // program
        const program = gl.createProgram();
        if (program == null) {
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

        gl.attachShader(program, glVertexShader);
        gl.attachShader(program, glFragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(program);
            throw `Could not compile WebGL program. \n\n${info}`;
        }
        gl.useProgram(program);

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
        gl.uniform1f(
            timeUniformLocation,
            (Date.now() - startTimeRef.current) / 1000
        );

        const mouseUniformLocation = gl.getUniformLocation(
            program,
            'u_mousePosition'
        );
        gl.uniform2fv(mouseUniformLocation, [
            mouseRef.current?.x ?? 0.0,
            window.innerHeight - (mouseRef.current?.y ?? 0.0),
        ]);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        let frame = 0;
        const update = (gl: WebGL2RenderingContext) => {
            const now = Date.now();
            const delta = now - lastUpdateRef.current;
            const hasFramesElapsed = delta > 1000 / 30;
            const isPrefersReducedMotionEnabled =
                prefersReducedMotionRef.current === true;
            const isGlitchPause =
                Math.floor((now - startTimeRef.current) / 1000 + 1) % 5 === 0;
            if (
                hasFramesElapsed &&
                !isPrefersReducedMotionEnabled &&
                !isGlitchPause
            ) {
                gl.uniform1f(
                    timeUniformLocation,
                    (now - startTimeRef.current) / 1000
                );
                gl.uniform2fv(mouseUniformLocation, [
                    mouseRef.current?.x ?? 0.0,
                    window.innerHeight - (mouseRef.current?.y ?? 0.0),
                ]);

                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLES, 0, 6);

                lastUpdateRef.current = now;
            }

            if (frame !== 0) {
                requestAnimationFrame(() => update(gl));
            }
        };
        frame = requestAnimationFrame(() => update(gl));

        function onMediaQueryChange() {
            prefersReducedMotionRef.current = mediaQuery.matches;
        }

        function onMouseMove(event: MouseEvent) {
            mouseRef.current = event;
        }

        const mediaQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        );
        prefersReducedMotionRef.current = mediaQuery.matches;
        mediaQuery.addEventListener('change', onMediaQueryChange);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', setDimensions);

        return () => {
            gl.deleteProgram(program);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', setDimensions);
            mediaQuery.removeEventListener('change', onMediaQueryChange);
            cancelAnimationFrame(frame);
            frame = 0;
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                height: '100%',
                width: '100%',
            }}
        ></canvas>
    );
}
