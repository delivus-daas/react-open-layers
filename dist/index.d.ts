import React, { ReactNode, ReactElement } from 'react';
import { Options } from 'ol/style/Icon';
import VectorSource from 'ol/source/Vector';
import { ViewOptions, FitOptions } from 'ol/View';
import { Options as Options$1 } from 'ol/layer/BaseTile';
import { DefaultsOptions } from 'ol/interaction/defaults';
import { Geometry } from 'ol/geom';
import { Feature } from 'ol';
import { Options as Options$2 } from 'ol/source/Cluster';
import { Options as Options$3 } from 'ol/style/Style';
import { Coordinate as Coordinate$1 } from 'ol/coordinate';
import { Pixel } from 'ol/pixel';
import { Options as Options$4 } from 'ol/Overlay';
import { Options as Options$5 } from 'ol/control/Control';

type Coordinate = {
    latitude: number;
    longitude: number;
};
type MarkerProps = {
    properties?: {
        [x: string]: any;
    };
    source?: VectorSource;
    iconOptions?: Options;
    index: number;
    coordinate: Coordinate;
};

declare global {
    interface Window {
        mouseOut: boolean;
    }
}
declare const Marker: React.ForwardRefExoticComponent<MarkerProps & React.RefAttributes<unknown>>;

interface OpenLayersProps {
    interactionOptions?: DefaultsOptions;
    layerOptions?: Options$1<any>;
    viewOptions?: ViewOptions;
    initialCenter?: number[];
    className?: string;
    onMapBoundChanged?: (bounds: any) => void;
    children?: ReactNode | ReactNode[];
}

declare const Map: React.ForwardRefExoticComponent<OpenLayersProps & React.RefAttributes<unknown>>;

type LayerProps = {
    fitOptions?: FitOptions;
    markers?: MarkerProps[];
    onClick?: (features: Feature<Geometry>[], event: any) => void;
    index?: number;
    children: (source?: VectorSource) => ReactNode | ReactNode[];
    enableFitWhenClick?: boolean;
    onClickMap?: () => void;
    onMouseOverFeatures?: (feature: Feature<Geometry>[], event: Event) => void;
    onMouseOutFeatures?: () => void;
    onClickFeatures?: (feature: Feature<Geometry>[], event: Event) => void;
};
interface ClusterLayerProps extends LayerProps {
    clusterOptions?: Options$2;
    clusterStyle?: (resolution: number, size: number, fill?: Array<number>) => Options$3;
}

declare const Layer: ({ children, fitOptions, enableFitWhenClick, onClickMap, onClickFeatures, onMouseOutFeatures, onMouseOverFeatures, }: LayerProps) => React.JSX.Element;

declare const ClusterLayer: ({ children, fitOptions, clusterOptions, clusterStyle, enableFitWhenClick, onClickMap, onClickFeatures, onMouseOutFeatures, onMouseOverFeatures, }: ClusterLayerProps) => React.JSX.Element;

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

export { ClusterLayer, Controller as Control, Layer, Marker, Map as OpenLayers, CustomOverlay as Overlay };
