'use client';

import {
    CSSProperties,
    useRef,
    useState,
    useLayoutEffect,
    useEffect,
    createContext,
    PropsWithChildren,
    useContext,
} from 'react';
import { useFrame } from '../hooks/useFrame';

const FRAME_MS = 1000 / 20;
export default function BackgroundCanvas({ style }: { style?: CSSProperties }) {
    const { vertexShader, fragmentShader } = useBackgroundContext();
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
        const timeNormalized =
            Date.now() / 1000 - Math.floor(Date.now() / 1000);
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
            if (
                context != null &&
                currentWidth != null &&
                currentHeight != null
            ) {
                update(context, currentWidth, currentHeight);
            }
        },
        FRAME_MS,
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
        if (!fragmentShader || !vertexShader) {
            return;
        }

        const gl = canvasRef.current?.getContext('webgl2');
        if (gl == null) {
            return;
        }

        // vertex shader
        const glVertexShader = gl.createShader(gl.VERTEX_SHADER);
        if (glVertexShader == null) {
            return;
        }
        gl.shaderSource(glVertexShader, vertexShader);
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
        gl.shaderSource(glFragmentShader, fragmentShader);
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
    }, [fragmentShader, vertexShader]);

    return (
        <canvas
            height={currentHeight}
            ref={canvasRef}
            style={{
                height: '100%',
                width: '100%',
                ...style,
            }}
            width={currentWidth}
        ></canvas>
    );
}

const BackgroundContext = createContext({
    setShaders: (
        vertexShaderSource: string,
        fragmentShaderSource: string
    ) => {},
    vertexShader: ``,
    fragmentShader: ``,
});
interface BackgroundContextProviderProps extends PropsWithChildren {}
export function BackgroundContextProvider({
    children,
}: BackgroundContextProviderProps) {
    const [vertexShader, setVertexShader] = useState(``);
    const [fragmentShader, setFragmentShader] = useState(``);

    function setShaders(
        vertexShaderSource: string,
        fragmentShaderSource: string
    ) {
        setVertexShader(vertexShaderSource);
        setFragmentShader(fragmentShaderSource);
    }

    return (
        <BackgroundContext.Provider
            value={{
                setShaders,
                vertexShader,
                fragmentShader,
            }}
        >
            {children}
        </BackgroundContext.Provider>
    );
}

export function useBackgroundContext() {
    return useContext(BackgroundContext);
}
