import { Canvas } from "@react-three/fiber";
import { Environment, Center } from "@react-three/drei";

import Shirt from "./Shirt";
import CameraRig from "./CameraRig";
import Backdrop from "./Backdrop";

const CanvasModel = () => {
     return (
          <Canvas>
               <ambientLight intensity={0.5}></ambientLight>
               <Environment preset="city"></Environment>
               <CameraRig>
                    {/* <Backdrop></Backdrop> */}
                    <Center>
                         <Shirt></Shirt>
                    </Center>
               </CameraRig>
          </Canvas>
     );
};

export default CanvasModel;
