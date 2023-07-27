import { ReactNode } from "react";
import { Feature } from "ol";
import { FitOptions, ViewOptions } from "ol/View";
import { Geometry } from "ol/geom";
import { Options } from "ol/layer/BaseTile";
import { DefaultsOptions } from "ol/interaction/defaults";

export interface OpenLayersProps {
  interactionOptions?: DefaultsOptions;
  layerOptions?: Options<any>;
  viewOptions?: ViewOptions;
  initialCenter?: number[];
  className?: string;
  onMapBoundChanged?: (bounds: any) => void;
  children?: ReactNode | ReactNode[];
}

export enum FeatureNames {
  marker = "marker",
  cluster = "cluster",
}
