import React from "react";
import { LayerProps } from "./layer.type";
declare global {
    interface Window {
        mouseOut: boolean;
    }
}
declare const Layer: ({ children, onClick }: LayerProps) => React.JSX.Element;
export default Layer;
