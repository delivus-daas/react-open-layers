import React, { ReactNode, ReactElement } from 'react';
import { ViewOptions, FitOptions } from 'ol/View';
import { DefaultsOptions } from 'ol/interaction/defaults';
import ol, { Feature } from 'ol';
import Collection from 'ol/Collection';
import LayerGroup from 'ol/layer/Group';
import BaseLayer from 'ol/layer/Base';
import { Extent } from 'ol/extent';
import { Options } from 'ol/control/ZoomSlider';
import { ObjectEvent } from 'ol/Object';
import { StyleLike } from 'ol/style/Style';
import { GeolocationError } from 'ol/Geolocation';
import { Coordinate } from 'ol/coordinate';
import VectorSource from 'ol/source/Vector';
import { Options as Options$2 } from 'ol/style/Icon';
import { Options as Options$1 } from 'ol/layer/BaseVector';
import { SelectEvent } from 'ol/interaction/Select';
import { Options as Options$3 } from 'ol/source/Cluster';
import { Pixel } from 'ol/pixel';
import { Options as Options$4 } from 'ol/Overlay';
import { Options as Options$5 } from 'ol/control/Control';
import { Geometry } from 'ol/geom';
import { Options as Options$6 } from 'ol/interaction/Draw';

type GeolocationType = {
    fillColor?: string;
    strokeColor?: string;
    positionStyle?: StyleLike;
    trackGeolocation?: boolean;
    onError?: (error: GeolocationError) => void;
    onChangePosition?: (coordinates: Coordinate) => void;
};

interface zoomStyleProps {
    width?: string;
    height?: string;
    backgroundColor?: string;
    bottom?: string;
    top?: string;
    left?: string;
    right?: string;
}
interface OpenLayersProps extends GeolocationType {
    interactionOptions?: DefaultsOptions;
    layers?: BaseLayer[] | Collection<BaseLayer> | LayerGroup | undefined;
    showGeolocation?: boolean;
    geolocationOptions?: GeolocationType;
    showZoom?: boolean;
    showZoomSlider?: boolean;
    zoomOptions?: Options;
    zoom?: zoomStyleProps;
    zoomInStyle?: zoomStyleProps;
    zoomOutStyle?: zoomStyleProps;
    viewOptions?: ViewOptions;
    initialCenter?: number[];
    className?: string;
    children?: ReactNode | ReactNode[];
    fitOptions?: FitOptions;
    enableFitWhenClick?: boolean;
    onClickMap?: () => void;
    onClick?: (feature: Feature[], event: ol.MapBrowserEvent<any>) => void;
    onLoadStart?: (event: ol.MapEvent) => void;
    onResolutionChange?: (event: ObjectEvent) => void;
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

declare const OpenLayers: React.ForwardRefExoticComponent<OpenLayersProps & React.RefAttributes<unknown>>;

interface PointProps {
    properties?: {
        [x: string]: any;
    };
    source?: VectorSource;
    iconOptions?: Options$2;
    index: number;
    coordinate: Coordinate;
}
type PointLayerProps = {
    options?: Options$1<any>;
    points?: PointProps[];
    onSourceCreated?: (source: VectorSource) => void;
    onClick?: (selected: Feature[], deselected: Feature[], event: SelectEvent) => void;
    onOver?: (selected: Feature[], deselected: Feature[], event: SelectEvent) => void;
    index?: number;
    children?: (source?: VectorSource) => ReactNode | ReactNode[];
};

declare const PointLayer: ({ points, options, }: PointLayerProps) => null;

interface ClusterLayerProps extends PointLayerProps {
    clusterOptions?: Options$3;
    clusterStyle?: (resolution: number, size: number, features: Feature[]) => StyleLike;
}

declare const ClusterLayer: ({ points, clusterOptions, options, onClick, onOver, onSourceCreated, clusterStyle, }: ClusterLayerProps) => React.JSX.Element;

type OverlayProps = {
    /**
     * unique id to get overlay container element
     */
    id: string;
    /**
     * className for overlay container element
     */
    className?: string;
    position?: Coordinate;
    pixel?: Pixel;
    children?: ReactElement;
    options?: Options$4;
};

declare const CustomOverlay: ({ children, className, id, position, options, }: OverlayProps) => React.JSX.Element;

type ControlProps = {
    /**
     * unique id to get overlay container element
     */
    id: string;
    /**
     * className for overlay container element
     */
    className?: string;
    children: any;
    options?: Options$5;
};

declare const Controller: ({ id, children, className, options, }: ControlProps) => React.JSX.Element;

type PolygonProps = {
    coordinates: Array<Coordinate>;
    strokeColor?: string;
    fillColor?: string;
    strokeWidth?: number;
    code: string;
};
type PolygonLayerProps = {
    polygons?: Array<PolygonProps>;
    options?: Options$1<any>;
    polygonStyle?: StyleLike;
    onClick?: (features: Feature<Geometry>[], event: any) => void;
    index?: number;
    showCode?: boolean;
    children?: (source?: VectorSource) => ReactNode | ReactNode[];
};

declare const PolygonLayer: ({ polygons, options, polygonStyle, showCode, }: PolygonLayerProps) => null;

type DrawProps = {
    /**
     * unique id to get overlay container element
     */
    drawStyle?: StyleLike;
    drawnStyle?: StyleLike;
    onSourceCreated?: (source: VectorSource) => void;
    onDrawStart?: (coordinate: Coordinate, event: any) => void;
    onDrawEnd?: (event: any) => void;
    onGetPointsInsidePolygon?: (coordinate: Coordinate, event: any) => void;
    onDrawAbort?: (coordinate: Coordinate, event: any) => void;
    options?: Options$6;
};

declare const CustomDraw: ({ drawStyle, drawnStyle, onDrawEnd, onDrawAbort, onDrawStart, onSourceCreated, options, }: DrawProps) => null;

export { ClusterLayer, Controller, CustomDraw, CustomOverlay, OpenLayers, PointLayer, PolygonLayer };
