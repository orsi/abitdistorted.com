'use client';

import { useEffect } from 'react';
import { useBackgroundContext } from '../../components/BackgroundCanvas';

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
        gl_FragColor.a = rand(vertFragPosition * u_time) * 0.1;
    }
`;
export default function JonsTuner() {
    const { setShaders } = useBackgroundContext();
    useEffect(() => {
        setShaders(vertexShaderSource, fragmentShaderSource);
    }, []);

    return (
        <section>
            <p>
                <strong>Jon&apos;s Tuner</strong> is an iOS and Android mobile
                application for tuning instruments.
            </p>
            <div
                style={{
                    marginTop: '16px',
                }}
            >
                <small>
                    <strong>Privacy Policy</strong>
                    <p>
                        Jon&apos;s Tuner analyzes microphone audio to display
                        musical note and frequency information. No audio is
                        recorded or saved on your device.
                    </p>
                </small>
            </div>
        </section>
    );
}
