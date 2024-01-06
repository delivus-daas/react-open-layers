import { Options } from "ol/interaction/Draw";
import { Coordinate } from "ol/coordinate";

export type DrawProps = {
  /**
   * unique id to get overlay container element
   */
  onDrawStart?: (coordinate: Coordinate, event: any) => void;
  onDrawEnd?: (event: any) => void;
  onGetPointsInsidePolygon?: (coordinate: Coordinate, event: any) => void;
  onDrawAbort?: (coordinate: Coordinate, event: any) => void;
  options?: Options;
};
