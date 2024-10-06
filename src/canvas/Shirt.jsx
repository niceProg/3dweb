import React from "react";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";

import state from "../store";

const Shirt = () => {
     const snap = useSnapshot(state);
     const { nodes, materials } = useGLTF("/shirt_baked.glb");

     // Load textures
     const logoTexture = useTexture(snap.logoDecal);
     const fullTexture = useTexture(snap.fullDecal);

     // Set anisotropy value directly to the textures (if available)
     if (logoTexture) logoTexture.anisotropy = 16;

     // Update material color using easing function
     useFrame((state, delta) => {
          easing.dampC(materials.lambert1.color, snap.color, 0.25, delta);
          // if (materials.lambert1) {
          //      easing.dampC(materials.lambert1.color, snap.color, 0.25, delta);
          // }
     });

     const stateString = JSON.stringify(snap);

     return (
          <group key={stateString}>
               <mesh castShadow geometry={nodes.T_Shirt_male.geometry} material={materials.lambert1} material-roughness={1} dispose={null}>
                    {/* Apply full texture if applicable */}
                    {snap.isFullTexture && (
                         <Decal
                              position={[0, 0, 0]}
                              rotation={[0, 0, 0]}
                              scale={1}
                              map={fullTexture} // No need to set anisotropy here
                         />
                    )}

                    {/* Apply logo texture with anisotropy 16 */}
                    {snap.isLogoTexture && <Decal position={[0, 0.04, 0.15]} rotation={[0, 0, 0]} scale={0.15} map={logoTexture} depthTest={false} depthWrite={true} />}
               </mesh>
          </group>
     );
};

export default Shirt;
