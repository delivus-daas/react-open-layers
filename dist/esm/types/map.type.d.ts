import { ReactNode } from "react";
import { Feature, Map } from "ol";
export type MapContextType = {
    map?: Map;
    clusterEnabled?: boolean;
};
export type OpenLayersProps = {
    clusterEnabled?: boolean;
    minZoom?: number;
    maxZoom?: number;
    initialZoom?: number;
    initialCenter?: Array<number>;
    className?: string;
    onMapBoundChanged?: (bounds: any) => void;
    children?: ReactNode | ReactNode[];
    onClickMap?: () => void;
    onMouseOver?: (feature: Feature[]) => void;
    onMouseOut?: () => void;
    onClickFeature?: (feature: Feature[]) => void;
};
export declare enum FeatureNames {
    marker = "marker",
    cluster = "cluster"
}
