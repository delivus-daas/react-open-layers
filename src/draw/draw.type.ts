import * as ol from "ol";
import { DrawEvent, Options } from "ol/interaction/Draw";
import { Coordinate } from "ol/coordinate";
import VectorSource from "ol/source/Vector";
import { StyleLike } from "ol/style/Style";
import BaseEvent from "ol/events/Event";

export type DrawProps = {
  /**
   * unique id to get overlay container element
   */
  map?: ol.Map;
  drawStyle?: StyleLike;
  drawnStyle?: StyleLike;
  options?: Options;
  visible?: boolean;
  /*Listeners*/
  onSourceCreated?: (source: VectorSource) => void;
  onDrawStart?: (event: BaseEvent | Event) => void;
  onDrawEnd?: (event: DrawEvent) => void;
  onDrawAbort?: (event: BaseEvent | Event) => void;
  onGetPointsInsidePolygon?: (coordinate: Coordinate, event: any) => void;
};
