import React, { ReactNode, ReactElement } from 'react';
import ol, { Feature } from 'ol';
import { ViewOptions, FitOptions } from 'ol/View';
import { Geometry } from 'ol/geom';
import { DefaultsOptions } from 'ol/interaction/defaults';
import { FeatureLike } from 'ol/Feature';
import Collection from 'ol/Collection';
import LayerGroup from 'ol/layer/Group';
import BaseLayer from 'ol/layer/Base';
import VectorSource from 'ol/source/Vector';
import { Options as Options$1 } from 'ol/source/Cluster';
import { Options as Options$2 } from 'ol/style/Style';
import { Options as Options$3 } from 'ol/style/Icon';
import { Options } from 'ol/layer/BaseVector';
import { Coordinate as Coordinate$1 } from 'ol/coordinate';
import { Pixel } from 'ol/pixel';
import { Options as Options$4 } from 'ol/Overlay';
import { Options as Options$5 } from 'ol/control/Control';

interface zoomStyleProps {
    width?: string;
    height?: string;
    backgroundColor?: string;
    bottom?: string;
    top?: string;
    left?: string;
    right?: string;
}
interface OpenLayersProps {
    interactionOptions?: DefaultsOptions;
    layers?: BaseLayer[] | Collection<BaseLayer> | LayerGroup | undefined;
    showZoom?: boolean;
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
    onClick?: (feature: FeatureLike[], event: ol.MapBrowserEvent<any>) => void;
    onLoadStart?: (event: ol.MapEvent) => void;
    onLoadEnd?: (event: ol.MapEvent) => void;
    onMoveStart?: (event: ol.MapEvent) => void;
    onMoveEnd?: (event: ol.MapEvent) => void;
    onPointerDrag?: (event: ol.MapBrowserEvent<any>) => void;
    onPointerMove?: (event: ol.MapBrowserEvent<any>) => void;
    onPostRender?: (event: ol.MapEvent) => void;
    onPostCompose?: (event: any) => void;
    onPreCompose?: (event: any) => void;
    onRenderComplete?: (event: any) => void;
    onDoubleClick?: (feature: FeatureLike[], event: ol.MapBrowserEvent<any>) => void;
    onMouseOverFeatures?: (feature: Feature<Geometry>[], event: Event) => void;
    onMouseOutFeatures?: (feature?: Feature<Geometry>[]) => void;
    onClickFeatures?: (feature: Feature<Geometry>[], event: Event) => void;
    moveTolerance?: number;
    maxTilesLoading?: number;
}

declare const OpenLayers: React.ForwardRefExoticComponent<OpenLayersProps & React.RefAttributes<unknown>>;

type Coordinate = {
    latitude: number;
    longitude: number;
};
interface FeatureProps {
    properties?: {
        [x: string]: any;
    };
    source?: VectorSource;
    iconOptions?: Options$3;
    index: number;
    coordinate: Coordinate;
}
type LayerProps = {
    options?: Options<any>;
    features?: FeatureProps[];
    onClick?: (features: Feature<Geometry>[], event: any) => void;
    index?: number;
    children?: (source?: VectorSource) => ReactNode | ReactNode[];
};
interface ClusterLayerProps extends LayerProps {
    clusterOptions?: Options$1;
    clusterStyle?: (resolution: number, size: number, fill?: Array<number>) => Options$2;
}

declare const Layer: ({ features, options }: LayerProps) => null;

declare const ClusterLayer: ({ features, clusterOptions, options, clusterStyle, }: ClusterLayerProps) => null;

type OverlayProps = {
    /**
     * unique id to get overlay container element
     */
    id: string;
    /**
     * className for overlay container element
     */
    className?: string;
    position?: Coordinate$1;
    pixel?: Pixel;
    children: ReactElement;
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
    coordinates: string[][];
    options?: Options<any>;
    onClick?: (features: Feature<Geometry>[], event: any) => void;
    index?: number;
    children?: (source?: VectorSource) => ReactNode | ReactNode[];
};

declare const CustomPolygon: ({ coordinates, options }: PolygonProps) => null;

export { ClusterLayer, Controller as Control, Layer, OpenLayers, CustomOverlay as Overlay, CustomPolygon as Polygon };
