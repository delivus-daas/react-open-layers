import { ReactNode } from "react";
import VectorSource from "ol/source/Vector";
import { Geometry } from "ol/geom";
import { Feature } from "ol";
import { MarkerProps } from "../marker/marker.type";
import { Options as ClusterOptions } from "ol/source/Cluster";
import { Options } from "ol/style/Style";
export type LayerProps = {
    markers?: MarkerProps[];
    onClick?: (features: Feature<Geometry>[], event: any) => void;
    index?: number;
    children: (source?: VectorSource) => ReactNode | ReactNode[];
};
export interface ClusterLayerProps extends LayerProps {
    clusterOptions?: ClusterOptions;
    clusterStyle?: (resolution: number, size: number, fill?: Array<number>) => Options;
}
