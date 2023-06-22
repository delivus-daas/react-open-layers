import React from "react";
import "./index.css";
import { MapContextType, OpenLayersProps } from "./map.type";
declare global {
    interface Window {
        mouseOut: boolean;
    }
}
declare const OpenLayersMap: React.ForwardRefExoticComponent<OpenLayersProps & React.RefAttributes<unknown>>;
export default OpenLayersMap;
export declare const useMap: () => MapContextType;
