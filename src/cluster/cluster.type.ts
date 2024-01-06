import { Options as ClusterOptions } from "ol/source/Cluster";
import { PointLayerProps } from "../point/point.type";
import { Feature } from "ol";
import { StyleLike } from "ol/style/Style";

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export interface ClusterLayerProps extends PointLayerProps {
  clusterOptions?: ClusterOptions;
  clusterStyle?: (
    resolution: number,
    size: number,
    features: Feature[]
  ) => StyleLike;
}
