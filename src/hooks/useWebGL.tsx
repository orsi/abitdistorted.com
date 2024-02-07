'use client';

import { useRef, useEffect } from 'react';

export function useWebGL(
    vertexShader: string,
    fragmentShader: string,
    update: (gl: WebGL2RenderingContext) => void
) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (ref.current == null) {
            console.error('HTMLCanvasElement is null');
            return;
        }
        if (vertexShader == null) {
            console.error('Vertex Shader is null');
            return;
        }
        if (fragmentShader == null) {
            console.error('Fragment Shader is null');
            return;
        }

        const gl = ref.current.getContext('webgl2')!;
        const program = gl.createProgram()!;

        // vertex shader
        const glVertexShader = gl.createShader(gl.VERTEX_SHADER)!;
        gl.shaderSource(glVertexShader, vertexShader);
        gl.compileShader(glVertexShader);
        gl.attachShader(program, glVertexShader);

        // fragment shader
        const glFragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(glFragmentShader, fragmentShader);
        gl.compileShader(glFragmentShader);
        gl.attachShader(program, glFragmentShader);

        // program
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(program);
            throw `Could not compile WebGL program. \n\n${info}`;
        }

        gl.useProgram(program);
        return () => {
            console.log('deletE?');
            gl.deleteProgram(program);
        };
    }, [vertexShader, fragmentShader]);

    useEffect(() => {
        let frame = 0;
        function raf() {
            const gl = ref.current?.getContext('webgl2')!;
            update(gl);
            frame = requestAnimationFrame(raf);
        }
        frame = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(frame);
        };
    }, [update]);

    return (props: React.HTMLAttributes<HTMLCanvasElement>) => (
        <canvas {...props} ref={ref} />
    );
}
