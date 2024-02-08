import { useEffect, useRef } from 'react';

export default function Experiment4() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current == null) {
      return;
    }

    ref.current.width = window.innerWidth;
    ref.current.height = window.innerHeight;

    var gl = ref.current.getContext('webgl2');
    if (!gl) {
      console.error('WebGL 2 not available');
      return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    ///////////////////////////
    // SET UP PROGRAM
    ///////////////////////////

    var vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(
      vertexShader,
      `#version 300 es

    layout(std140) uniform;

    layout(location=0) in vec3 aPosition;
    layout(location=1) in vec3 aVelocity;
    layout(location=2) in vec3 aColor;

    uniform Mass {
        float mass1Factor;
        float mass2Factor;
        float mass3Factor;
        vec4 mass1Position;
        vec4 mass2Position;
        vec4 mass3Position;
    };

    out vec3 vPosition;
    out vec3 vVelocity;
    out vec3 vColor;
    void main() {
        vec3 position = aPosition;
        vec3 velocity = aVelocity;

        vec3 massVec = mass1Position.xyz - position;
        float massDist2 = max(0.01, dot(massVec, massVec));
        vec3 acceleration = mass1Factor * normalize(massVec) / massDist2;

        massVec = mass2Position.xyz - position;
        massDist2 = max(0.01, dot(massVec, massVec));
        acceleration += mass2Factor * normalize(massVec) / massDist2;

        massVec = mass3Position.xyz - position;
        massDist2 = max(0.01, dot(massVec, massVec));
        acceleration += mass3Factor * normalize(massVec) / massDist2;

        velocity += acceleration;
        velocity *= 0.9999;

        vPosition = position + velocity;
        vVelocity = velocity;

        vColor = aColor;
        gl_PointSize = 2.0;
        gl_Position = vec4(position, 1.0);
    }`
    );
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(vertexShader));
    }

    var fragment = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(
      fragment,
      `#version 300 es
    precision highp float;

    in vec3 vColor;

    out vec4 fragColor;
    void main() {
        float alpha = 0.3;
        fragColor = vec4(vColor * alpha, alpha);
    }`
    );
    gl.compileShader(fragment);

    if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(fragment));
    }

    var program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragment);
    gl.transformFeedbackVaryings(
      program,
      ['vPosition', 'vVelocity'],
      gl.SEPARATE_ATTRIBS
    );
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
    }

    gl.useProgram(program);

    ///////////////////////////////////////////
    // GET UNIFORM LOCATIONS
    ///////////////////////////////////////////

    var massUniformsLocation = gl.getUniformBlockIndex(program, 'Mass');
    gl.uniformBlockBinding(program, massUniformsLocation, 0);

    //////////////////////////
    // SET UP GEOMETRY
    //////////////////////////

    var NUM_PARTICLES = 200000;
    var positionData = new Float32Array(NUM_PARTICLES * 3);
    var velocityData = new Float32Array(NUM_PARTICLES * 3);
    var colorData = new Float32Array(NUM_PARTICLES * 3);

    for (var i = 0; i < NUM_PARTICLES; ++i) {
      var vec3i = i * 3;

      positionData[vec3i] = Math.random() * 2 - 1;
      positionData[vec3i + 1] = Math.random() * 2 - 1;
      positionData[vec3i + 2] = Math.random() * 2 - 1;

      colorData[vec3i] = Math.random();
      colorData[vec3i + 1] = Math.random();
      colorData[vec3i + 2] = Math.random();
    }

    //////////////////////////////////////
    // SET UP TRANSFORM FEEDBACK
    //////////////////////////////////////

    // Vertex array handles input
    var vertexArrayA = gl.createVertexArray();
    gl.bindVertexArray(vertexArrayA);

    var positionBufferA = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferA);
    gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STREAM_COPY);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    var velocityBufferA = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, velocityBufferA);
    gl.bufferData(gl.ARRAY_BUFFER, velocityData, gl.STREAM_COPY);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(2);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Transform feedback handles output
    var transformFeedbackA = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbackA);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, positionBufferA);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, velocityBufferA);

    // Vertex array handles input
    var vertexArrayB = gl.createVertexArray();
    gl.bindVertexArray(vertexArrayB);

    var positionBufferB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferB);
    gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STREAM_COPY);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    var velocityBufferB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, velocityBufferB);
    gl.bufferData(gl.ARRAY_BUFFER, velocityData, gl.STREAM_COPY);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(2);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Transform feedback handles output
    var transformFeedbackB = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbackB);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, positionBufferB);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, velocityBufferB);

    gl.bindVertexArray(null);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    var currentVertexArray = vertexArrayA;
    var currentTransformFeedback = transformFeedbackB;

    ///////////////////
    // UNIFORM DATA
    ///////////////////

    var massUniformData = new Float32Array(20);

    massUniformData[0] = Math.random() / 30000;
    massUniformData[1] = Math.random() / 30000;
    massUniformData[2] = Math.random() / 30000;

    massUniformData.set(
      new Float32Array([
        Math.random() * 2.0 - 1.0,
        Math.random() * 2.0 - 1.0,
        Math.random() * 2.0 - 1.0,
      ]),
      4
    );

    massUniformData.set(
      new Float32Array([
        Math.random() * 2.0 - 1.0,
        Math.random() * 2.0 - 1.0,
        Math.random() * 2.0 - 1.0,
      ]),
      8
    );

    massUniformData.set(
      new Float32Array([
        Math.random() * 2.0 - 1.0,
        Math.random() * 2.0 - 1.0,
        Math.random() * 2.0 - 1.0,
      ]),
      16
    );

    var massUniformBuffer = gl.createBuffer();
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, massUniformBuffer);
    gl.bufferData(gl.UNIFORM_BUFFER, massUniformData, gl.STATIC_DRAW);

    function draw() {
      if (!gl) {
        requestAnimationFrame(draw);
        return;
      }

      // NOTE(Tarek): Putting the clear after the transform feedback
      // pass seems to cause it to be ignored on OSX 10.12/Intel Iris
      gl.clear(gl.COLOR_BUFFER_BIT);

      //////////////////////////////
      // DRAW
      //////////////////////////////

      gl.bindVertexArray(currentVertexArray);
      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, currentTransformFeedback);

      // NOTE: THIS PART IS NECESSARY DUE TO A BUG IN ANGLE'S HANDLING
      // OF TRANFORM FEEDBACK OBJECTS.
      // TO BE REMOVED WHEN THAT'S FIXED.
      if (currentTransformFeedback === transformFeedbackA) {
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, positionBufferA);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, velocityBufferA);
      } else {
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, positionBufferB);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, velocityBufferB);
      }

      gl.beginTransformFeedback(gl.POINTS);
      gl.drawArrays(gl.POINTS, 0, NUM_PARTICLES);
      gl.endTransformFeedback();

      //////////////////
      // SWAP BUFFERS
      //////////////////

      if (currentVertexArray === vertexArrayA) {
        currentVertexArray = vertexArrayB;
        currentTransformFeedback = transformFeedbackA;
      } else {
        currentVertexArray = vertexArrayA;
        currentTransformFeedback = transformFeedbackB;
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }, []);

  return <canvas ref={ref} />;
}
