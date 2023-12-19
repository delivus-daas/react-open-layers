import { ReactNode } from "react";
import VectorSource from "ol/source/Vector";
import { Geometry } from "ol/geom";
import { Feature } from "ol";
import { Options } from "ol/layer/BaseVector";
import {Coordinate} from "../layers/layer.type";

export type PolygonProps = {
  coordinateGroups: Coordinate[][];
  options?: Options<any>;
  onClick?: (features: Feature<Geometry>[], event: any) => void;
  index?: number;
  children?: (source?: VectorSource) => ReactNode | ReactNode[];
};
