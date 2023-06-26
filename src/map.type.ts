import { ReactNode } from "react";
import { Feature } from "ol";
import { ViewOptions } from "ol/View";
import {FeatureLike} from "ol/Feature";

export interface OpenLayersProps extends ViewOptions {
  initialCenter?: number[];
  className?: string;
  onMapBoundChanged?: (bounds: any) => void;
  children?: ReactNode | ReactNode[];
  onClickMap?: () => void;
  onMouseOver?: (feature: FeatureLike[]) => void;
  onMouseOut?: () => void;
  onClickFeature?: (feature: FeatureLike[]) => void;
}

export enum FeatureNames {
  marker = "marker",
  cluster = "cluster",
}
