import { ReactNode } from "react";
import { Coordinate } from "ol/coordinate";
import { Pixel } from "ol/pixel";
import { Options } from "ol/Overlay";
export type ControlProps = {
    /**
     * className for overlay container element
     */
    className?: string;
    position?: Coordinate;
    pixel?: Pixel;
    children: ReactNode;
    options?: Options;
};
