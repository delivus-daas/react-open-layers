import { Options as ClusterOptions } from "ol/source/Cluster";
import { Feature, Map } from "ol";
import { FeatureLike } from "ol/Feature";
import { StyleFunction, StyleLike } from "ol/style/Style";
import VectorSource from "ol/source/Vector";
import { PointLayerProps } from "../map.type";

export interface ClusterLayerProps extends PointLayerProps {
  clusterOptions?: ClusterOptions;
  features: Feature[];
  map?: Map;
  visible?: boolean;
  distance?: number;
  zoom?: number;
  onInit?: (source: VectorSource) => void;
  overStyle?: StyleFunction
  clusterStyle?: StyleFunction
}
