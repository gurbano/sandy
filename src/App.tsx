import React from 'react';
import { Canvas } from "@react-three/fiber";
import ShaderPlane from './ShaderPlane';

const App = () => {
    return (
        <div>
            <Canvas style={{ width: "600px", height: "600px" }}>
                <ambientLight intensity={Math.PI / 2} />
                <ShaderPlane />
            </Canvas>
        </div>
    );
};

export default App;