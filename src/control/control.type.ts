import { ReactNode } from "react";
import {Options} from "ol/control/Control";

export type ControlProps = {
  /**
   * unique id to get overlay container element
   */
  id: string;
  /**
   * className for overlay container element
   */
  className?: string;
  children: any;
  options?: Options;
};
