'use client';

import { useRef, useEffect } from 'react';

interface WebGL2Options {
  vertexShader: string;
  fragmentShader: string;
}

const canvases: Record<string, HTMLCanvasElement> = {};

export function createCanvas(
  id: string,
  { vertexShader: vertex, fragmentShader: fragment }: WebGL2Options
) {
  if (canvases[id]) {
    console.warn(`A canvas with id ${id} already exists!`);
  } else {
    canvases[id] = document.createElement('canvas');
  }

  const gl = canvases[id].getContext('webgl2')!;
  const program = gl.createProgram()!;

  // setup shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
  }
  gl.useProgram(program);

  return {
    canvas: canvases[id],
    gl,
    program,
  };
}

export function createShader(
  gl: WebGL2RenderingContext,
  type:
    | WebGLRenderingContextBase['VERTEX_SHADER']
    | WebGLRenderingContextBase['FRAGMENT_SHADER'],
  source: string
) {
  const glShader = gl.createShader(type)!;
  gl.shaderSource(glShader, source);
  gl.compileShader(glShader);

  if (!gl.getShaderParameter(glShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(glShader));
  }

  return glShader;
}

interface ClearOptions {
  clearColor?: { r?: number; g?: number; b?: number; a?: number };
}
export function clear(gl: WebGL2RenderingContext, options?: ClearOptions) {
  gl.clearColor(
    options?.clearColor?.r ?? 0,
    options?.clearColor?.g ?? 0,
    options?.clearColor?.b ?? 0,
    options?.clearColor?.a ?? 1
  );
  gl.clear(gl.COLOR_BUFFER_BIT);
}

interface DrawOptions {
  drawCount?: number;
  drawFirst?: number;
  drawMode?: 'points' | 'lines' | 'triangles';
}
export function draw(
  gl: WebGL2RenderingContext,
  { drawCount, drawFirst, drawMode }: DrawOptions
) {
  let mode: number = gl.TRIANGLES;
  if (drawMode === 'points') {
    mode = gl.POINTS;
  } else if (drawMode === 'lines') {
    mode = gl.LINES;
  }
  gl.drawArrays(mode, drawFirst ?? 0, drawCount ?? 0);
}

export function resize(
  gl: WebGL2RenderingContext,
  width: number,
  height: number
) {
  gl.canvas.width = width;
  gl.canvas.height = height;
  gl.viewport(0, 0, width, height);
}

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

  return <canvas ref={ref} />;
}
