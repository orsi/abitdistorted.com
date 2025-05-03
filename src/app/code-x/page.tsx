'use client';

import { useEffect, useRef } from 'react';

const vertexShaderSource = `#version 300 es
        in vec2 vertPosition;
        in vec2 a_textCoord;
        out vec2 v_textCoord;

        void main() {
            gl_Position = vec4(vertPosition, 0.0, 1.0);
            v_textCoord = a_textCoord;
        }`;
const fragmentShaderSource = `#version 300 es
        precision mediump float;
        in vec2 v_textCoord;
        uniform float u_time;
        uniform sampler2D u_texture;
        out vec4 glFragColor;

        // https://thebookofshaders.com/10/
        float rand(vec2 co){
            return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        float noise(float x) {
            float i = floor(x);
            float f = fract(x);
            return mix(fract(sin(i)*1.0), fract(sin(i + 1.0)*1.0), smoothstep(0., 1., f));
        }

        float noise2d(vec2 co) {
            float n1 = noise(co.x);
            float n2 = noise(co.y);
            return mix(n1, n2, smoothstep(0., 1., rand(co)));
        }

        void main() {
            float frequency = 0.05 * (sin(u_time / 3.0) + (sin(u_time / 2.0) * 0.5) + (sin(u_time) * 0.25));
            float time_break = frequency > 0.05 ? frequency : 0.0;
            float xNoise = v_textCoord.x
                + clamp((rand(v_textCoord.xx + sin(u_time * 0.5) ) * 0.1 - 0.05) * time_break, -0.05, 0.05);
            float yNoise = v_textCoord.y 
                + clamp(noise(v_textCoord.y * 100.0 + u_time * 2.) * .01 - 0.005, -0.005, 0.005);

            glFragColor = vec4(texture(u_texture, vec2(xNoise, yNoise)).rgb, 0.3);
        }`;

export default function CodeX() {
  const startTimeRef = useRef(Date.now());
  const lastUpdateRef = useRef(startTimeRef.current);
  const prefersReducedMotionRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // calculate proper ratio for setting code-x image
    const getAspectRatioModifier = () => {
      const imageAspectRatio = 0.7;
      const targetWidth = window.innerHeight * imageAspectRatio;
      const normalizedWidth = targetWidth / window.innerWidth;
      return normalizedWidth * 2;
    };
    const minX = 0 - getAspectRatioModifier();
    const maxX = 0 + getAspectRatioModifier();
    const triangleVertices = [
      // x, y
      minX,
      1.0,
      minX,
      -1.0,
      maxX,
      -1.0,
      minX,
      1.0,
      maxX,
      -1.0,
      maxX,
      1.0,
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
      0,
      0
    );
    gl.enableVertexAttribArray(vertPositionAttributeLocation);

    const textCoordAttributeLocation = gl.getAttribLocation(
      program,
      'a_textCoord'
    );
    const textCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textCoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0]),
      gl.STATIC_DRAW
    );

    // load imge
    // Create a texture.
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 255])
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Asynchronously load an image
    var image = new Image();
    image.src = '/code-x.png';
    image.addEventListener('load', () => {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );
      gl.generateMipmap(gl.TEXTURE_2D);
    });
    gl.vertexAttribPointer(textCoordAttributeLocation, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(textCoordAttributeLocation);

    // uniforms
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
    gl.uniform1f(timeUniformLocation, 0);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    let frame = 0;
    const update = (gl: WebGL2RenderingContext) => {
      const now = Date.now();
      const delta = now - lastUpdateRef.current;
      const hasFramesElapsed = delta > 1000 / 24;
      const isPrefersReducedMotionEnabled =
        prefersReducedMotionRef.current === true;
      if (hasFramesElapsed && !isPrefersReducedMotionEnabled) {
        gl.uniform1f(timeUniformLocation, (now - startTimeRef.current) / 1000);

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

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    prefersReducedMotionRef.current = mediaQuery.matches;
    mediaQuery.addEventListener('change', onMediaQueryChange);

    function setDimensions() {
      if (!canvasRef.current || !gl || !program) {
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
      // calculate proper ratio for setting code-x image
      const minX = 0 - getAspectRatioModifier() * 0.5;
      const maxX = 0 + getAspectRatioModifier() * 0.5;
      const triangleVertices = [
        // x, y
        minX,
        1.0,
        minX,
        -1.0,
        maxX,
        -1.0,
        minX,
        1.0,
        maxX,
        -1.0,
        maxX,
        1.0,
      ];
      gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(triangleVertices),
        gl.STATIC_DRAW
      );
      gl.vertexAttribPointer(
        vertPositionAttributeLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.enableVertexAttribArray(vertPositionAttributeLocation);
    }
    setDimensions();

    window.addEventListener('resize', setDimensions);

    return () => {
      gl.deleteProgram(program);
      window.removeEventListener('resize', setDimensions);
      mediaQuery.removeEventListener('change', onMediaQueryChange);
      cancelAnimationFrame(frame);
      frame = 0;
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          height: '100%',
          width: '100%',
        }}
      ></canvas>
      <section>
        <h1 className="hidden">Code X</h1>
        <p>
          <strong>Code X</strong> is an interactive exploration of text, image
          and sound.
        </p>
        <div className="mt-2 text-xs font-thin">
          <a href="https://www.wmarksutherland.com/code-x">instructions</a> |{' '}
          <a href="https://code-x.live">interact</a>
        </div>
      </section>
    </>
  );
}
