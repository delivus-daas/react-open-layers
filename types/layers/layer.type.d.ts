import { ReactNode } from "react";
import VectorSource from "ol/source/Vector";
import { Geometry } from "ol/geom";
import { Feature } from "ol";
import { Options as ClusterOptions } from "ol/source/Cluster";
import { Options as StyleOptions } from "ol/style/Style";
import { Options as IconOptions } from "ol/style/Icon";
import { Options } from "ol/layer/BaseVector";
export type Coordinate = {
    latitude: number;
    longitude: number;
};
export interface FeatureProps {
    properties?: {
        [x: string]: any;
    };
    source?: VectorSource;
    iconOptions?: IconOptions;
    index: number;
    coordinate: Coordinate;
}
export type LayerProps = {
    options?: Options<any>;
    features?: FeatureProps[];
    onClick?: (features: Feature<Geometry>[], event: any) => void;
    index?: number;
    children?: (source?: VectorSource) => ReactNode | ReactNode[];
};
export interface ClusterLayerProps extends LayerProps {
    clusterOptions?: ClusterOptions;
    clusterStyle?: (resolution: number, size: number, fill?: Array<number>) => StyleOptions;
}
