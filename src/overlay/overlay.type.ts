import {ReactElement} from "react";
import { Coordinate } from "ol/coordinate";

export type OverlayProps = {
  coordinate?: Coordinate;
  children: ReactElement;
};
