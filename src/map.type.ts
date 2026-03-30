import { ReactNode } from "react";
import { FitOptions, ViewOptions } from "ol/View";
import { DefaultsOptions } from "ol/interaction/defaults";
import { Feature, Map, View, MapBrowserEvent, MapEvent } from "ol";
import Collection from "ol/Collection";
import LayerGroup from "ol/layer/Group";
import BaseLayer from "ol/layer/Base";
import { Options as ZoomOptions } from "ol/control/ZoomSlider";
import { GeolocationType } from "./geolocation/geolocation.type";

export interface zoomStyleProps {
  width?: string;
  height?: string;
  backgroundColor?: string;
  bottom?: string;
  top?: string;
  left?: string;
  right?: string;
}

export interface OpenLayersProps extends GeolocationType {
  interactionOptions?: DefaultsOptions;
  layers?: BaseLayer[] | Collection<BaseLayer> | LayerGroup | undefined;
  showGeolocation?: boolean;
  geolocationOptions?: GeolocationType;
  showZoom?: boolean;
  showZoomSlider?: boolean;
  zoomOptions?: ZoomOptions;
  zoomInStyle?: zoomStyleProps;
  zoomOutStyle?: zoomStyleProps;
  viewOptions?: ViewOptions;
  initialCenter?: number[];
  zoom?: number;
  center?: number[];
  className?: string;
  children?: ReactNode | ReactNode[];
  fitOptions?: FitOptions;
  enableFitWhenClick?: boolean;
  onInit?: (map: Map) => void;
  onClickMap?: () => void;
  onClick?: (feature: Feature[], event: MapBrowserEvent<any>) => void;
  onLoadStart?: (event: MapEvent) => void;
  onResolutionChange?: (view: View) => void;
  onLoadEnd?: (event: MapEvent) => void;
  onMoveStart?: (event: MapEvent) => void;
  onMoveEnd?: (event: MapEvent) => void;
  onPointerDrag?: (event: MapBrowserEvent<any>) => void;
  onPointerMove?: (feature: Feature[], event: MapBrowserEvent<any>) => void;
  onPointerOut?: (event: MapBrowserEvent<any>) => void;
  onMouseOut?: (event: MapBrowserEvent<any>) => void;
  onPostRender?: (event: MapEvent) => void;
  onPostCompose?: (event: any) => void;
  onPreCompose?: (event: any) => void;
  onRenderComplete?: (event: any) => void;
  onDoubleClick?: (feature: Feature[], event: MapBrowserEvent<any>) => void;
  moveTolerance?: number;
  maxTilesLoading?: number;
  extent?: [number]; //[minx, miny, maxx, maxy]
}

export enum EFeatureName {
  geo = "geo",
  marker = "marker",
  polygon = "polygon",
  cluster = "cluster",
}
