import { ReactNode } from "react";
import { Options } from "ol/style/Style";
import VectorSource from "ol/source/Vector";
import { FitOptions } from "ol/View";
import { Geometry } from "ol/geom";
import { Feature } from "ol";

export type LayerProps = {
  onClick?: (features: Feature<Geometry>[], event: any) => void;
  index?: number;
  children: (source?: VectorSource) => ReactNode | ReactNode[];
};

export interface ClusterLayerProps extends LayerProps {
  clusterOptions?: Options;
}
