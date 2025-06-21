import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateAttributes, generatePositionTexture } from './utils/Textures';

const PARTICLE_COUNT = 500;

const vertexShader = `
  uniform sampler2D positions;
  attribute vec2 ref;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 pos = texture2D(positions, ref);
    vec4 mvPosition = modelViewMatrix * vec4(pos.xyz, 1.0);
    gl_PointSize = 1.0;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, 1.0);
  }
`;

export default function ShaderPlane() {
  const points = useRef<THREE.Points>(null);

  // Generate random positions and colors for particles
  const { colors, refs } = useMemo(generateAttributes, []);
    console.log('Generated attributes:', { colors, refs });
  
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

  useFrame(() => {
    // Animate particles if you want
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
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          positions: { value: positionTexture }
        }}
        vertexColors
        transparent
      />
    </points>
  );
}