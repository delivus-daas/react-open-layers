import { ReactNode } from "react";
import VectorSource from "ol/source/Vector";
import { Geometry } from "ol/geom";
import { Feature } from "ol";
import { Options as IconOptions } from "ol/style/Icon";
import { Options } from "ol/layer/BaseVector";
import { Coordinate } from "ol/coordinate";

export interface PointProps {
  properties?: {
    [x: string]: any;
  };
  source?: VectorSource;
  iconOptions?: IconOptions;
  index: number;
  coordinate: Coordinate;
}

export type PointLayerProps = {
  options?: Options<any>;
  points?: PointProps[];
  onClick?: (features: Feature<Geometry>[], event: any) => void;
  onOver?: (features: Feature<Geometry>[], event: any) => void;
  index?: number;
  children?: (source?: VectorSource) => ReactNode | ReactNode[];
};
