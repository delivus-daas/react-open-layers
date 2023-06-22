import React from "react";
import { MarkerProps } from "./marker.type";
declare global {
    interface Window {
        mouseOut: boolean;
    }
}
declare const Marker: React.ForwardRefExoticComponent<MarkerProps<any> & React.RefAttributes<unknown>>;
export default Marker;
