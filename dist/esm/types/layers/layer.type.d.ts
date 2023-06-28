import { ReactNode } from "react";
import { Options } from "ol/style/Style";
import VectorSource from "ol/source/Vector";
import { FeatureLike } from "ol/Feature";
import { FitOptions } from "ol/View";
export type LayerProps = {
    onClick?: (features: FeatureLike[]) => void;
    index?: number;
    children: (source?: VectorSource) => ReactNode | ReactNode[];
};
export interface ClusterLayerProps extends LayerProps {
    enableFit?: boolean;
    fitOptions?: FitOptions;
    clusterOptions?: Options;
}
