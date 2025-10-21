import { Options as ClusterOptions } from "ol/source/Cluster";
import { PointLayerProps } from "../point/point.type";
import { Feature, Map } from "ol";
import { FeatureLike } from "ol/Feature";
import { Style } from "ol/style";
export interface ClusterLayerProps extends PointLayerProps {
    clusterOptions?: ClusterOptions;
    features: Feature[];
    map: Map;
    clickStyle?: (feature: Feature) => Style;
    overStyle?: (feature: Feature) => Style;
    clusterStyle?: (feature: FeatureLike) => Style;
}
