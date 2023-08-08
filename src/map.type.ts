import { ReactNode } from "react";
import { Feature } from "ol";
import { FitOptions, ViewOptions } from "ol/View";
import { Geometry } from "ol/geom";
import { Options } from "ol/layer/BaseTile";
import { DefaultsOptions } from "ol/interaction/defaults";
import {FeatureLike} from "ol/Feature";
import ol from "ol"

export interface zoomStyleProps {
  width?: string;
  height?: string;
  backgroundColor?: string;
  bottom?:string;
  top?:string;
  left?:string;
  right?:string;
}

export interface OpenLayersProps {
  interactionOptions?: DefaultsOptions;
  layerOptions?: Options<any>;
  showZoom?:boolean;
  zoomInStyle?: zoomStyleProps;
  zoomOutStyle?: zoomStyleProps;
  viewOptions?: ViewOptions;
  initialCenter?: number[];
  className?: string;
  onMapBoundChanged?: (bounds: any) => void;
  children?: ReactNode | ReactNode[];
  fitOptions?: FitOptions;
  enableFitWhenClick?: boolean;
  onClickMap?: () => void;
  onLoadStart?: (event:  ol.MapEvent)=>void;
  onLoadEnd?: (event:  ol.MapEvent)=>void;
  onMoveStart?: (event:  ol.MapEvent)=>void;
  onMoveEnd?: (event:  ol.MapEvent)=>void;
  onPointerDrag?: (event:  ol.MapBrowserEvent<any>)=>void;
  onPointerMove?: (event:  ol.MapBrowserEvent<any>)=>void;
  onDoubleClick?:(feature: FeatureLike[], event:  ol.MapBrowserEvent<any>) => void;
  onMouseOverFeatures?: (feature: Feature<Geometry>[], event: Event) => void;
  onMouseOutFeatures?: (feature?: Feature<Geometry>[]) => void;
  onClickFeatures?: (feature: Feature<Geometry>[], event: Event) => void;
  moveTolerance?: number;
  maxTilesLoading?: number;
}

export enum FeatureNames {
  marker = "marker",
  cluster = "cluster",
}
