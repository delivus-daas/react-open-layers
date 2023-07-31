import { ReactNode } from "react";
import VectorSource from "ol/source/Vector";
import { Geometry } from "ol/geom";
import { Feature } from "ol";
import { MarkerProps } from "../marker/marker.type";
import { Options as ClusterOptions } from "ol/source/Cluster";
import { Options } from "ol/style/Style";
import { FitOptions } from "ol/View";
export type LayerProps = {
    fitOptions?: FitOptions;
    markers?: MarkerProps[];
    onClick?: (features: Feature<Geometry>[], event: any) => void;
    index?: number;
    children: (source?: VectorSource) => ReactNode | ReactNode[];
    enableFitWhenClick?: boolean;
    onClickMap?: () => void;
    onMouseOverFeatures?: (feature: Feature<Geometry>[], event: Event) => void;
    onMouseOutFeatures?: (feature?: Feature<Geometry>[]) => void;
    onClickFeatures?: (feature: Feature<Geometry>[], event: Event) => void;
};
export interface ClusterLayerProps extends LayerProps {
    clusterOptions?: ClusterOptions;
    clusterStyle?: (resolution: number, size: number, fill?: Array<number>) => Options;
}
