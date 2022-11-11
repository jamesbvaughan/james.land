import type { NextPage } from "next";

import { Canvas } from "@react-three/fiber";
import { Center, Text3D } from "@react-three/drei";
import { PropsWithChildren } from "react";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";

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

        <EffectComposer>
          <DepthOfField
            focusDistance={0}
            focalLength={0.02}
            bokehScale={2}
            height={480}
          />
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Home;
