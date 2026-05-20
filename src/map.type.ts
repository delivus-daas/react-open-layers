import { ReactNode } from "react";
import { FitOptions, ViewOptions } from "ol/View";
import { DefaultsOptions } from "ol/interaction/defaults";
import { Feature, Map, MapBrowserEvent, MapEvent, View } from "ol";
import Collection from "ol/Collection";
import LayerGroup from "ol/layer/Group";
import BaseLayer from "ol/layer/Base";
import { Options as ZoomOptions } from "ol/control/ZoomSlider";
import VectorSource, { Options as SourceOptions } from "ol/source/Vector";
import { Options as IconOptions } from "ol/style/Icon";
import { Coordinate } from "ol/coordinate";
import { Options } from "ol/layer/BaseVector";
import { SelectEvent } from "ol/interaction/Select";
import RenderEvent from "ol/render/Event";

export interface zoomStyleProps {
  width?: string;
  height?: string;
  backgroundColor?: string;
  bottom?: string;
  top?: string;
  left?: string;
  right?: string;
}

export interface OpenLayersProps {
  initialInteractionOptions?: DefaultsOptions;
  initialLayers?: BaseLayer[] | Collection<BaseLayer> | LayerGroup | undefined;
  showZoom?: boolean;
  initialShowZoomSlider?: boolean;
  zoomOptions?: ZoomOptions;
  zoomInStyle?: zoomStyleProps;
  zoomOutStyle?: zoomStyleProps;
  initialViewOptions?: ViewOptions;
  initialCenter?: number[];
  zoom?: number;
  center?: number[];
  className?: string;
  children?: ReactNode | ReactNode[];
  fitOptions?: FitOptions;
  enableFitWhenClick?: boolean;
  onInit?: (map: Map) => void;
  onClickMap?: () => void;
  onClick?: (event: MapBrowserEvent) => void;
  onLoadStart?: (event: MapEvent) => void;
  onResolutionChange?: (view: View) => void;
  onLoadEnd?: (event: MapEvent) => void;
  onMoveStart?: (event: MapEvent) => void;
  onMoveEnd?: (event: MapEvent) => void;
  onPointerDrag?: (event: MapBrowserEvent) => void;
  onPointerMove?: (event: MapBrowserEvent) => void;
  onPointerOut?: (event: MapBrowserEvent) => void;
  onMouseOut?: (event: MapBrowserEvent) => void;
  onPostRender?: (event: MapEvent) => void;
  onPostCompose?: (event: RenderEvent) => void;
  onPreCompose?: (event: RenderEvent) => void;
  onRenderComplete?: (event: RenderEvent) => void;
  onDoubleClick?: (event: MapBrowserEvent) => void;
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

export interface PointProps {
  properties?: {
    [x: string]: unknown;
  };
  source?: VectorSource;
  iconOptions?: IconOptions;
  index: number;
  coordinate: Coordinate;
}

export type PointLayerProps = {
  options?: SourceOptions;
  layerOptions?: Options<Feature, VectorSource<Feature>>;
  points?: PointProps[];
  onSourceCreated?: (source: VectorSource) => void;
  onClick?: (selected: Feature[], deselected: Feature[], event: SelectEvent) => void;
  onOver?: (selected: Feature[], deselected: Feature[], event: SelectEvent) => void;
  index?: number;
  name?: string;
  children?: (source?: VectorSource) => ReactNode | ReactNode[];
};
