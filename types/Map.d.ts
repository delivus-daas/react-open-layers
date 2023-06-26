import React from "react";
import "./index.css";
import { OpenLayersProps } from "./map.type";
declare global {
    interface Window {
        mouseOut: boolean;
    }
}
declare const Map: React.ForwardRefExoticComponent<OpenLayersProps & React.RefAttributes<unknown>>;
export default Map;
export declare const useMap: () => any;
