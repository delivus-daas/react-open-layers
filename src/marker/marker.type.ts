import { Options } from "ol/style/Icon";
import VectorSource from "ol/source/Vector";

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type MarkerProps = {
  properties?: {
    [x: string]: any;
  };
  source?: VectorSource;
  iconOptions?: Options;
  index: number;
  coordinate: Coordinate;
};
