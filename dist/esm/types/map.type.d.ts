import { ReactNode } from "react";
import { Feature } from "ol";
import { FitOptions, ViewOptions } from "ol/View";
import { Geometry } from "ol/geom";
import { Options } from "ol/layer/BaseTile";
import { DefaultsOptions } from "ol/interaction/defaults";
export interface OpenLayersProps {
    interactionOptions?: DefaultsOptions;
    enableFitWhenClick?: boolean;
    layerOptions?: Options<any>;
    viewOptions?: ViewOptions;
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
