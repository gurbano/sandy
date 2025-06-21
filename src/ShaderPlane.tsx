import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { generateAttributes, generatePositionTexture, generateRenderTarget } from './utils/Textures';

const PARTICLE_COUNT = 500;

const vertexShader = `
  uniform sampler2D positions;
  attribute vec2 ref;
  attribute float type;
  varying float vType;
  void main() {
    vType = type;
    vec4 pos = texture2D(positions, ref);
    vec4 mvPosition = modelViewMatrix * vec4(pos.xyz, 1.0);
    gl_PointSize = 2.0;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying float vType;
  void main() {
    vec3 color;
    if (vType < 0.5) {
      color = vec3(0.76, 0.70, 0.50); // sand
    } else if (vType < 1.5) {
      color = vec3(0.2, 0.4, 1.0); // water
    } else {
      color = vec3(1.0, 0.3, 0.1); // fire
    }
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function ShaderPlane() {
  const points = useRef<THREE.Points>(null);
  const { gl } = useThree();
  
  // Generate random positions and colors for particles
  const { types, refs } = useMemo(generateAttributes, []);
  
  // Create two render targets for ping-pong
  const rtA = useMemo(generateRenderTarget, []);
  const rtB = useMemo(() => rtA.clone(), [rtA]);


    // Create the position texture
  const positionTexture = useMemo(() => {
    const tex = generatePositionTexture();
    tex.needsUpdate = true;
    tex.type = THREE.FloatType;
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    return tex;
  }, []);


  //1 Initialize render target with initial positions
  useEffect(() => {
    gl.setRenderTarget(rtA);
    gl.clear();
    gl.copyTextureToTexture(positionTexture, rtA.texture, undefined, new THREE.Vector2(0, 0));
    gl.setRenderTarget(null);
  }, [gl, positionTexture, rtA]);

  const ping = useRef(true);

  useFrame((_, delta) => {
    // Swap render targets
    const read = ping.current ? rtA : rtB;
    const write = ping.current ? rtB : rtA;

    // Update uniforms
    // simScene.material.uniforms.positions.value = read.texture;
    // simScene.material.uniforms.dt.value = delta;
    
    // Render simulation step
    // gl.setRenderTarget(write);
    // gl.render(simScene.scene, simScene.camera);
    // gl.setRenderTarget(null);
    // Use updated positions for rendering
    // points.current.material.uniforms.positions.value = write.texture;
    ping.current = !ping.current;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
            attach="attributes-position"
            count={refs.length / 2}
            array={new Float32Array(refs.length)}
            itemSize={3}
        />
        <bufferAttribute
            attach="attributes-ref"
            count={refs.length / 2}
            array={refs}
            itemSize={2}
        />
        <bufferAttribute
            attach="attributes-type"
            count={types.length}
            array={types}
            itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          positions: { value: positionTexture },
          dt: { value: 0.016 },
          gravity: { value: -1 },
        }}
        vertexColors
        transparent
      />
    </points>
  );
}