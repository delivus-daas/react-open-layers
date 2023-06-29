import {ReactElement} from "react";
import { Coordinate } from "ol/coordinate";
import {Pixel} from "ol/pixel";
import {Options} from "ol/Overlay";

export type OverlayProps = {
  /**
   * unique id to get overlay container element
   */
  id: string;

  /**
   * className for overlay container element
   */
  className?: string;
  position?: Coordinate;
  pixel?: Pixel;
  children: ReactElement;
  options?: Options;
};
