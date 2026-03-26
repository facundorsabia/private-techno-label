'use client';

import { useEffect, useRef, useCallback } from 'react';

// ─── Vertex Shader ───────────────────────────────────────
const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// ─── Fragment Shader ─────────────────────────────────────
const FRAGMENT_SHADER = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;

  //
  // Simplex 3D noise — Stefan Gustavson (webgl-noise)
  //
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    // Permutations
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;

    // ── Dot grid ──────────────────────────────────────
    float gridSize = 90.0;
    vec2 gridUV = uv * gridSize;
    gridUV.x *= aspect;

    vec2 cellCenter = floor(gridUV) + 0.5;
    vec2 cellUV = fract(gridUV) - 0.5;

    // Normalised position for noise sampling
    vec2 noiseCoord = cellCenter / gridSize;
    noiseCoord.x /= aspect;

    // ── Mouse influence (gentle) ──────────────────────
    vec2 mouseNorm = u_mouse;
    float mouseDist = length(uv - mouseNorm);
    float mouseInfluence = smoothstep(0.30, 0.0, mouseDist) * 0.4;

    // ── Ocean wave motion ─────────────────────────────
    float slowTime = u_time * 0.08;

    // Layered horizontal waves like the sea
    float wave1 = sin(noiseCoord.x * 6.0 - slowTime * 3.0 + noiseCoord.y * 2.0) * 0.5;
    float wave2 = sin(noiseCoord.x * 10.0 + slowTime * 2.0 - noiseCoord.y * 3.0) * 0.3;
    float wave3 = cos(noiseCoord.y * 8.0 - slowTime * 1.5 + noiseCoord.x * 4.0) * 0.2;

    // Noise to break the regularity — gives organic feel
    float n1 = snoise(vec3(noiseCoord * 3.0, slowTime * 0.6));
    float n2 = snoise(vec3(noiseCoord * 5.5 + 100.0, slowTime * 0.9));

    // Combine waves + noise for ocean landscape
    float waveField = wave1 + wave2 + wave3 + n1 * 0.35 + n2 * 0.15;

    // Mouse ripple — concentric wave emanating from cursor
    float mouseRipple = sin(mouseDist * 40.0 - u_time * 2.5) * mouseInfluence * 0.3;
    waveField += mouseRipple;

    // ── Dot displacement (wave-driven) ────────────────
    vec2 displacement = vec2(
      sin(noiseCoord.y * 8.0 + slowTime * 2.0) * 0.08 + snoise(vec3(noiseCoord * 3.5, slowTime * 0.5 + 50.0)) * 0.10,
      cos(noiseCoord.x * 6.0 + slowTime * 1.5) * 0.10 + snoise(vec3(noiseCoord * 3.5 + 300.0, slowTime * 0.5 + 80.0)) * 0.08
    );

    // Mouse gently pushes dots
    if (mouseDist < 0.30) {
      vec2 pushDir = normalize(uv - mouseNorm + 0.001);
      displacement += pushDir * mouseInfluence * 0.08;
    }

    vec2 dotPos = cellUV - displacement;
    float dist = length(dotPos);

    // ── Dot size (subtle variation) ───────────────────
    float baseRadius = 0.08;
    float radiusMod = (waveField * 0.3 + 0.5) * 0.10;
    float mouseRadius = mouseInfluence * 0.04;
    float dotRadius = baseRadius + radiusMod + mouseRadius;

    // ── Dot shape ─────────────────────────────────────
    float dotShape = 1.0 - smoothstep(dotRadius - 0.03, dotRadius + 0.02, dist);

    // ── Brightness: very subtle, translucent ──────────
    float brightness = (waveField * 0.35 + 0.5);
    brightness = clamp(brightness, 0.08, 0.85);
    brightness = pow(brightness, 1.8); // push darks darker

    // Mouse area gently glows
    brightness += mouseInfluence * 0.15;
    brightness = clamp(brightness, 0.0, 0.55);

    // Global opacity — this is the key to translucency
    float opacity = 0.30;

    float finalAlpha = dotShape * brightness * opacity;

    // ── Color palette: muted dark tones ───────────────
    // Base: very dim warm grey with subtle orange undertone
    vec3 baseColor = vec3(0.45, 0.38, 0.32);

    // Wave crests get a hint of the brand orange
    vec3 crestColor = vec3(0.9, 0.42, 0.12);
    float crestMix = smoothstep(0.3, 0.7, waveField * 0.5 + 0.5) * 0.15;

    // Mouse area gets warmer
    vec3 mouseColor = vec3(0.95, 0.55, 0.25);
    float mouseMix = mouseInfluence * 0.3;

    vec3 dotColor = mix(baseColor, crestColor, crestMix);
    dotColor = mix(dotColor, mouseColor, mouseMix);

    vec3 color = dotColor * finalAlpha;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animFrameRef = useRef<number>(0);
  const glRef = useRef<WebGLRenderingContext | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX / window.innerWidth;
    mouseRef.current.y = 1.0 - e.clientY / window.innerHeight; // flip Y for GL
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }
    glRef.current = gl;

    // ── Compile shaders ──────────────────────────────
    function createShader(type: number, source: string): WebGLShader | null {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // ── Full-screen quad ─────────────────────────────
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // ── Uniforms ─────────────────────────────────────
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    // ── Resize handler ───────────────────────────────
    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 1.5); // cap for performance
      canvas!.width = canvas!.clientWidth * dpr;
      canvas!.height = canvas!.clientHeight * dpr;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Animation loop ───────────────────────────────
    const startTime = performance.now();

    function render() {
      const elapsed = (performance.now() - startTime) / 1000;
      gl!.uniform2f(uResolution, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, elapsed);
      gl!.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      animFrameRef.current = requestAnimationFrame(render);
    }

    animFrameRef.current = requestAnimationFrame(render);

    // ── Mouse tracking ───────────────────────────────
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(posBuffer);
    };
  }, [handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      id="noise-background"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
