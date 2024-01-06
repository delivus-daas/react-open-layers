import { ReactNode } from "react";
import VectorSource from "ol/source/Vector";
import { Geometry } from "ol/geom";
import { Feature } from "ol";
import { Options as IconOptions } from "ol/style/Icon";
import { Options } from "ol/layer/BaseVector";
import { Coordinate } from "ol/coordinate";
import { SelectEvent } from "ol/interaction/Select";
import { FeatureLike } from "ol/Feature";

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
  onClick?: (
    selected: Feature[],
    deselected: Feature[],
    event: SelectEvent
  ) => void;
  onOver?: (
    selected: Feature[],
    deselected: Feature[],
    event: SelectEvent
  ) => void;
  index?: number;
  children?: (source?: VectorSource) => ReactNode | ReactNode[];
};
