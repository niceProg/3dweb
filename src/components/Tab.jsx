import React from "react";
import { useSnapshot } from "valtio";
import state from "../store";

const Tab = ({ tab, isFilterTab, isActiveTab, handleClick }) => {
     const snap = useSnapshot(state);

     // Define active styles based on isActiveTab
     const activeStyles = isActiveTab
          ? {
                 border: "2px solid", // Add border when active
                 borderColor: snap.color, // Use the picked color for the border
                 opacity: 1,
            }
          : {
                 border: "2px solid transparent", // No border when inactive
                 opacity: 0.5, // Optional: reduce opacity when inactive
            };

     return (
          <div
               key={tab.name}
               className={`tab-btn ${isFilterTab ? "rounded-full glassmorhism" : "rounded-lg"}`}
               onClick={handleClick}
               style={activeStyles} // Apply active/inactive styles here
          >
               <img src={tab.icon} alt={tab.name} className={`${isFilterTab ? "w-2/3 h-2/3" : "w-11/12 h-11/12 object-contain"}`} />
          </div>
     );
};

export default Tab;
