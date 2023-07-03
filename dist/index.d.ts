import React, { ReactNode, ReactElement } from 'react';
import { Options } from 'ol/style/Icon';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { ViewOptions, FitOptions } from 'ol/View';
import { Geometry } from 'ol/geom';
import { Options as Options$1 } from 'ol/layer/BaseTile';
import { DefaultsOptions } from 'ol/interaction/defaults';
import { Options as Options$2 } from 'ol/style/Style';
import { Coordinate as Coordinate$1 } from 'ol/coordinate';
import { Pixel } from 'ol/pixel';
import { Options as Options$3 } from 'ol/Overlay';
import { Options as Options$4 } from 'ol/control/Control';

type Coordinate = {
    latitude: number;
    longitude: number;
};
type MarkerProps<T> = {
    properties?: {
        [x: string]: any;
    };
    source?: VectorSource;
    iconOptions?: Options;
    datum?: T;
    index: number;
    coordinate: Coordinate;
};

declare global {
    interface Window {
        mouseOut: boolean;
    }
}
declare const Marker: React.ForwardRefExoticComponent<MarkerProps<any> & React.RefAttributes<unknown>>;

interface OpenLayersProps {
    interactionOptions?: DefaultsOptions;
    enableFitWhenClick?: boolean;
    layerOptions?: Options$1<any>;
    viewOptions?: ViewOptions;
    fitOptions?: FitOptions;
    initialCenter?: number[];
    className?: string;
    onMapBoundChanged?: (bounds: any) => void;
    children?: ReactNode | ReactNode[];
    onClickMap?: () => void;
    onMouseOverFeatures?: (feature: Feature<Geometry>[], event: Event) => void;
    onMouseOutFeatures?: () => void;
    onClickFeatures?: (feature: Feature<Geometry>[], event: Event) => void;
}

declare const Map: React.ForwardRefExoticComponent<OpenLayersProps & React.RefAttributes<unknown>>;

type LayerProps = {
    onClick?: (features: Feature<Geometry>[], event: any) => void;
    index?: number;
    children: (source?: VectorSource) => ReactNode | ReactNode[];
};
interface ClusterLayerProps extends LayerProps {
    clusterOptions?: Options$2;
}

declare const Layer: ({ children, onClick }: LayerProps) => React.JSX.Element;

declare const ClusterLayer: ({ children, clusterOptions }: ClusterLayerProps) => React.JSX.Element;

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
    options?: Options$3;
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
    options?: Options$4;
};

declare const Controller: ({ id, children, className, options }: ControlProps) => React.JSX.Element;

export { ClusterLayer, Controller as Control, Layer, Marker, Map as OpenLayers, CustomOverlay as Overlay };
