import { ReactNode } from "react";
import VectorSource from "ol/source/Vector";
import { Geometry } from "ol/geom";
import { Feature } from "ol";
import { Options } from "ol/layer/BaseVector";
export type PolygonProps = {
    coordinates: string[][];
    options?: Options<any>;
    onClick?: (features: Feature<Geometry>[], event: any) => void;
    index?: number;
    children?: (source?: VectorSource) => ReactNode | ReactNode[];
};
