import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";

import config from "../config/config";
import state from "../store";
import { download, logoShirt, stylishShirt } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from "../components";

const Customizer = () => {
     const snap = useSnapshot(state);
     const [file, setFile] = useState("");
     const [prompt, setPrompt] = useState("");
     const [generatingImg, setGeneratingImg] = useState(false);
     const [activeEditorTab, setActiveEditorTab] = useState("");
     const [activeFilterTab, setActiveFilterTab] = useState({
          logoShirt: true,
          stylishShirt: false,
     });

     const generateTabContent = () => {
          switch (activeEditorTab) {
               case "colorpicker":
                    return <ColorPicker />;
               case "filepicker":
                    return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
               case "aipicker":
                    return <AIPicker prompt={prompt} setPrompt={setPrompt} generatingImg={generatingImg} handleSubmit={handleSubmit} />;
               default:
                    return null;
          }
     };

     const handleSubmit = async (type) => {
          if (!prompt) return alert("Please enter a prompt");

          try {
               setGeneratingImg(true);

               // Check prompt value in the console for debugging
               console.log("Submitting prompt:", prompt);

               const response = await fetch("http://localhost:8080/api/v1/modelslab", {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt }), // Ensure prompt is correctly passed
               });

               const data = await response.json();
               console.log("API Response:", data); // Log API response for debugging

               if (data.response.status === "success" && data.response.output.length > 0) {
                    const imageUrl = data.response.output[0];
                    handleDecals(type, imageUrl);
               } else {
                    alert(data.message || "No image generated");
               }
          } catch (error) {
               console.error("Error generating image:", error); // Log the error for debugging
               alert("Error generating image");
          } finally {
               setGeneratingImg(false);
               setActiveEditorTab("");
          }
     };

     const handleDecals = (type, result) => {
          const decalType = DecalTypes[type];
          console.log("Updating state for decal type:", decalType.stateProperty, "with result:", result); // Log state update

          state[decalType.stateProperty] = result;

          if (!activeFilterTab[decalType.filterTab]) {
               handleActiveFilterTab(decalType.filterTab);
          }
     };

     const handleActiveFilterTab = (tabName) => {
          const updatedFilterTabs = { ...activeFilterTab };

          switch (tabName) {
               case "logoShirt":
                    updatedFilterTabs.logoShirt = !activeFilterTab.logoShirt;
                    state.isLogoTexture = updatedFilterTabs.logoShirt;
                    break;
               case "stylishShirt":
                    updatedFilterTabs.stylishShirt = !activeFilterTab.stylishShirt;
                    state.isFullTexture = updatedFilterTabs.stylishShirt;
                    break;
               default:
                    updatedFilterTabs.logoShirt = false;
                    updatedFilterTabs.stylishShirt = true;
                    state.isFullTexture = true;
                    state.isLogoTexture = false;
          }

          setActiveFilterTab(updatedFilterTabs);
     };

     const readFile = (type) => {
          reader(file).then((result) => {
               handleDecals(type, result);
               setActiveEditorTab("");
          });
     };

     return (
          <AnimatePresence>
               {!snap.intro && (
                    <>
                         <motion.div key="custom" className="absolute top-0 left-0 z-10" {...slideAnimation("left")}>
                              <div className="flex items-center min-h-screen">
                                   <div className="editortabs-container tabs">
                                        {EditorTabs.map((tab) => (
                                             <Tab key={tab.name} tab={tab} handleClick={() => setActiveEditorTab(tab.name)} />
                                        ))}
                                        {generateTabContent()}
                                   </div>
                              </div>
                         </motion.div>
                         <motion.div className="absolute z-10 top-5 right-5" {...fadeAnimation}>
                              <CustomButton type="filled" title="Go Back" handleClick={() => (state.intro = true)} customStyles="w-fit px-4 py-2.5 font-bold text-sm" />
                         </motion.div>
                         <motion.div className="filtertabs-container" {...slideAnimation("up")}>
                              {FilterTabs.map((tab) => (
                                   <Tab key={tab.name} tab={tab} isFilterTab isActiveTab={activeFilterTab[tab.name]} handleClick={() => handleActiveFilterTab(tab.name)} />
                              ))}
                         </motion.div>
                    </>
               )}
          </AnimatePresence>
     );
};

export default Customizer;
