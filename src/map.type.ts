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
  fitOptions?: FitOptions;
  enableFitWhenClick?: boolean;
  onClickMap?: () => void;
  onMouseOverFeatures?: (feature: Feature<Geometry>[], event: Event) => void;
  onMouseOutFeatures?: (feature?: Feature<Geometry>[]) => void;
  onClickFeatures?: (feature: Feature<Geometry>[], event: Event) => void;
}

export enum FeatureNames {
  marker = "marker",
  cluster = "cluster",
}
