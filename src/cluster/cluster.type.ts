import { Options as ClusterOptions } from "ol/source/Cluster";
import { PointLayerProps } from "../point/point.type";
import { Feature, Map } from "ol";
import { FeatureLike } from "ol/Feature";
import { StyleLike } from "ol/style/Style";
import VectorSource from "ol/source/Vector";

export interface ClusterLayerProps extends PointLayerProps {
  clusterOptions?: ClusterOptions;
  features: Feature[];
  map?: Map;
  visible?: boolean;
  distance?: number;
  zoom?: number;
  onInit?: (source: VectorSource) => void;
  overStyle?: (feature: FeatureLike, resolution: number) => StyleLike | undefined
  clusterStyle?: (feature: FeatureLike, resolution: number) => StyleLike | undefined
}
