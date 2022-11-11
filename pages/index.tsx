import type { NextPage } from "next";

import { Canvas } from "@react-three/fiber";
import { Center, Text3D } from "@react-three/drei";
import { PropsWithChildren } from "react";

const BigText = ({
  children,
  ...props
}: PropsWithChildren<{ size?: number }>) => {
  return (
    <Text3D font="rubik.json" {...props}>
      {children}
      <meshStandardMaterial color="#7643d3" />
    </Text3D>
  );
};

const Home: NextPage = () => {
  return (
    <div className="absolute inset-0">
      <Canvas>
        <color attach="background" args={["black"]} />

        <ambientLight />
        <pointLight position={[10, 10, 10]} />

        <Center position={[0, 1, 0]}>
          <BigText size={0.4}>welcome to</BigText>
        </Center>

        <Center>
          <BigText>james.land</BigText>
        </Center>
      </Canvas>
    </div>
  );
};

export default Home;
