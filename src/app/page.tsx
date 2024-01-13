'use client';

import { useEffect } from 'react';
import { useBackgroundContext } from '../components/BackgroundCanvas';
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
        gl_FragColor.a = rand(vertFragPosition * u_time) * 0.25;
    }
`;
export default function Home() {
    const { setShaders } = useBackgroundContext();
    useEffect(() => {
        setShaders(vertexShaderSource, fragmentShaderSource);
    }, []);
    return (
        <section>
            <h1>
                <div>a</div>
                <div>bit</div>
                <div>distorted</div>
            </h1>
        </section>
    );
}
