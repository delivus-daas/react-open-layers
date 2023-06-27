import { ReactNode } from "react";
import { Options } from "ol/style/Style";
import VectorSource from "ol/source/Vector";
import {FeatureLike} from "ol/Feature";

export type LayerProps = {
  onClick?: (features: FeatureLike[])=>void;
  clusterOptions?: Options;
  index?: number;
  children: (source?: VectorSource) => ReactNode | ReactNode[];
};
