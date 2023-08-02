import React, { ReactNode, ReactElement } from 'react';
import { Feature } from 'ol';
import { ViewOptions, FitOptions } from 'ol/View';
import { Geometry } from 'ol/geom';
import { Options } from 'ol/layer/BaseTile';
import { DefaultsOptions } from 'ol/interaction/defaults';
import VectorSource from 'ol/source/Vector';
import { Options as Options$1 } from 'ol/source/Cluster';
import { Options as Options$2 } from 'ol/style/Style';
import { Options as Options$3 } from 'ol/style/Icon';
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
    layerOptions?: Options<any>;
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
    onMouseOverFeatures?: (feature: Feature<Geometry>[], event: Event) => void;
    onMouseOutFeatures?: (feature?: Feature<Geometry>[]) => void;
    onClickFeatures?: (feature: Feature<Geometry>[], event: Event) => void;
}

declare const Map: React.ForwardRefExoticComponent<OpenLayersProps & React.RefAttributes<unknown>>;

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
    features?: FeatureProps[];
    onClick?: (features: Feature<Geometry>[], event: any) => void;
    index?: number;
    children?: (source?: VectorSource) => ReactNode | ReactNode[];
};
interface ClusterLayerProps extends LayerProps {
    clusterOptions?: Options$1;
    clusterStyle?: (resolution: number, size: number, fill?: Array<number>) => Options$2;
}

declare const Layer: ({ features }: LayerProps) => null;

declare const ClusterLayer: ({ features, clusterOptions, clusterStyle, }: ClusterLayerProps) => null;

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

export { ClusterLayer, Controller as Control, Layer, Map as OpenLayers, CustomOverlay as Overlay };
