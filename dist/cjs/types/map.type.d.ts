import { ReactNode } from "react";
import { FitOptions, ViewOptions } from "ol/View";
import { DefaultsOptions } from "ol/interaction/defaults";
import ol, { Feature, Map, View } from "ol";
import Collection from "ol/Collection";
import LayerGroup from "ol/layer/Group";
import BaseLayer from "ol/layer/Base";
import { Extent } from "ol/extent";
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
    zoom?: zoomStyleProps;
    zoomInStyle?: zoomStyleProps;
    zoomOutStyle?: zoomStyleProps;
    viewOptions?: ViewOptions;
    initialCenter?: number[];
    center?: number[];
    className?: string;
    children?: ReactNode | ReactNode[];
    fitOptions?: FitOptions;
    enableFitWhenClick?: boolean;
    onInit?: (map: Map) => void;
    onClickMap?: () => void;
    onClick?: (feature: Feature[], event: ol.MapBrowserEvent<any>) => void;
    onLoadStart?: (event: ol.MapEvent) => void;
    onResolutionChange?: (view: View) => void;
    onLoadEnd?: (event: ol.MapEvent) => void;
    onMoveStart?: (event: ol.MapEvent) => void;
    onMoveEnd?: (event: ol.MapEvent, extent?: Extent) => void;
    onPointerDrag?: (event: ol.MapBrowserEvent<any>) => void;
    onPointerMove?: (feature: Feature[], event: ol.MapBrowserEvent<any>) => void;
    onPointerOut?: (event: ol.MapBrowserEvent<any>) => void;
    onMouseOut?: (event: ol.MapBrowserEvent<any>) => void;
    onPostRender?: (event: ol.MapEvent) => void;
    onPostCompose?: (event: any) => void;
    onPreCompose?: (event: any) => void;
    onRenderComplete?: (event: any) => void;
    onDoubleClick?: (feature: Feature[], event: ol.MapBrowserEvent<any>) => void;
    moveTolerance?: number;
    maxTilesLoading?: number;
}
export declare enum EFeatureName {
    geo = "geo",
    marker = "marker",
    polygon = "polygon",
    cluster = "cluster"
}
