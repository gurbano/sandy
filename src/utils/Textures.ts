import * as THREE from 'three';

const PARTICLE_COUNT = 1024*1024; // Use a square number for easy texture mapping
const TEXTURE_SIZE = Math.ceil(Math.sqrt(PARTICLE_COUNT));

export const generatePositionTexture = () => {
  const data = new Float32Array(TEXTURE_SIZE * TEXTURE_SIZE * 4);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    data[i * 4 + 0] = (Math.random() - 0.5) * 4; // x
    data[i * 4 + 1] = (Math.random() - 0.5) * 4; // y
    data[i * 4 + 2] = (Math.random() - 0.5) * 4; // z
    data[i * 4 + 3] = 1.0; // unused
  }
  return new THREE.DataTexture(data, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType);
}

export const generateAttributes = () => {
    const colors = [];
    const refs = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      colors.push(Math.random(), Math.random(), Math.random());
      // Calculate UV reference for this particle
      const x = (i % TEXTURE_SIZE) / TEXTURE_SIZE + 0.5 / TEXTURE_SIZE;
      const y = Math.floor(i / TEXTURE_SIZE) / TEXTURE_SIZE + 0.5 / TEXTURE_SIZE;
      refs.push(x, y);
    }
    return {
      colors: new Float32Array(colors),
      refs: new Float32Array(refs),
    };
  }