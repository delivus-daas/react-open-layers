import { ReactNode } from "react";
import { Feature } from "ol";
import { FitOptions, ViewOptions } from "ol/View";
import { Geometry } from "ol/geom";
export interface OpenLayersProps extends ViewOptions {
    enableFitWhenClick?: boolean;
    fitOptions?: FitOptions;
    initialCenter?: number[];
    className?: string;
    onMapBoundChanged?: (bounds: any) => void;
    children?: ReactNode | ReactNode[];
    onClickMap?: () => void;
    onMouseOverFeatures?: (feature: Feature<Geometry>[], event: Event) => void;
    onMouseOutFeatures?: () => void;
    onClickFeatures?: (feature: Feature<Geometry>[], event: Event) => void;
}
export declare enum FeatureNames {
    marker = "marker",
    cluster = "cluster"
}
