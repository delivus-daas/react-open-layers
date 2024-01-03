import { Options as ClusterOptions } from "ol/source/Cluster";
import { Options as StyleOptions } from "ol/style/Style";
import { PointLayerProps } from "../point/point.type";

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export interface ClusterLayerProps extends PointLayerProps {
  clusterOptions?: ClusterOptions;
  clusterStyle?: (
    resolution: number,
    size: number,
    fill?: Array<number>
  ) => StyleOptions;
}
