import { ReactNode } from "react";
import { Feature } from "ol";
import { FitOptions, ViewOptions } from "ol/View";
import { FeatureLike } from "ol/Feature";
import { Geometry } from "ol/geom";

export interface OpenLayersProps extends ViewOptions {
  enableFitWhenClick?: boolean;
  fitOptions?: FitOptions;
  initialCenter?: number[];
  className?: string;
  onMapBoundChanged?: (bounds: any) => void;
  children?: ReactNode | ReactNode[];
  onClickMap?: () => void;
  onMouseOver?: (feature: Feature<Geometry>[], event: any) => void;
  onMouseOut?: () => void;
  onClickFeatures?: (feature: Feature<Geometry>[], event: any) => void;
}

export enum FeatureNames {
  marker = "marker",
  cluster = "cluster",
}
