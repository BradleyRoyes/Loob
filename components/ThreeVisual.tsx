import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Box } from '@react-three/drei'; // Make sure to install @react-three/drei if you want to use it

const ThreeVisual = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Box position={[0, 0, 0]} args={[1, 1, 1]} > // args are the dimensions of the Box
        <meshStandardMaterial attach="material" color="hotpink" />
      </Box>
    </Canvas>
  );
};

export default ThreeVisual;
