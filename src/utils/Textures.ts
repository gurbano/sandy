import * as THREE from 'three';

const PARTICLE_COUNT = 1024*1024; // Use a square number for easy texture mapping
export const TEXTURE_SIZE = Math.ceil(Math.sqrt(PARTICLE_COUNT));

export const generatePositionTexture = () => {
  const data = new Float32Array(TEXTURE_SIZE * TEXTURE_SIZE * 4);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    data[i * 4 + 0] = (Math.random() - 0.5) * 4; // x
    data[i * 4 + 1] = 2.0 + Math.random() * 1.0; // y (near the top)
    data[i * 4 + 2] = (Math.random() - 0.5) * 4; // z
    data[i * 4 + 3] = 1.0; // occupied
  }
  return new THREE.DataTexture(data, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType);
}

export const generateAttributes = () => {
    const types = [];
    const refs = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Assign a random type: 0 = sand, 1 = water, 2 = fire, etc.
      types.push(Math.floor(Math.random() * 3));
      const x = (i % TEXTURE_SIZE) / TEXTURE_SIZE + 0.5 / TEXTURE_SIZE;
      const y = Math.floor(i / TEXTURE_SIZE) / TEXTURE_SIZE + 0.5 / TEXTURE_SIZE;
      refs.push(x, y);
    }
    return {
      types: new Float32Array(types),
      refs: new Float32Array(refs),
    };
}

export const generateRenderTarget = () => new THREE.WebGLRenderTarget(TEXTURE_SIZE, TEXTURE_SIZE, {
    type: THREE.FloatType,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    depthBuffer: false,
    stencilBuffer: false,
  });
