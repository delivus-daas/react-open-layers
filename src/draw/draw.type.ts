import { Options } from "ol/interaction/Draw";
import { Coordinate } from "ol/coordinate";
import VectorSource from "ol/source/Vector";
import { StyleLike } from "ol/style/Style";

export type DrawProps = {
  /**
   * unique id to get overlay container element
   */
  drawStyle?: StyleLike;
  drawnStyle?: StyleLike;
  onSourceCreated?: (source: VectorSource) => void;
  onDrawStart?: (coordinate: Coordinate, event: any) => void;
  onDrawEnd?: (event: any) => void;
  onGetPointsInsidePolygon?: (coordinate: Coordinate, event: any) => void;
  onDrawAbort?: (coordinate: Coordinate, event: any) => void;
  options?: Options;
};
