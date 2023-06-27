import React from "react";
import { LayerProps } from "./layer.type";
declare global {
    interface Window {
        mouseOut: boolean;
    }
}
declare const ClusterLayer: ({ children, clusterOptions, onClick }: LayerProps) => React.JSX.Element;
export default ClusterLayer;
