import React from "react";
import { ClusterLayerProps } from "./layer.type";
declare global {
    interface Window {
        mouseOut: boolean;
    }
}
declare const ClusterLayer: ({ children, clusterOptions, enableFit, fitOptions, onClick }: ClusterLayerProps) => React.JSX.Element;
export default ClusterLayer;
