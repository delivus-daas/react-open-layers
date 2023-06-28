import React, { ReactNode, ReactElement } from 'react';
import { Options } from 'ol/style/Icon';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { ViewOptions, FitOptions } from 'ol/View';
import { Geometry } from 'ol/geom';
import { Options as Options$1 } from 'ol/style/Style';
import { Coordinate as Coordinate$1 } from 'ol/coordinate';

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

interface OpenLayersProps extends ViewOptions {
    enableFitWhenClick?: boolean;
    fitOptions?: FitOptions;
    initialCenter?: number[];
    className?: string;
    onMapBoundChanged?: (bounds: any) => void;
    children?: ReactNode | ReactNode[];
    onClickMap?: () => void;
    onMouseOver?: (feature: Feature<Geometry>[], event: any) => void;
    onMouseOut?: () => void;
    onClickFeatures?: (feature: Feature<Geometry>[], event: any) => void;
}

declare const Map: React.ForwardRefExoticComponent<OpenLayersProps & React.RefAttributes<unknown>>;

type LayerProps = {
    onClick?: (features: Feature<Geometry>[], event: any) => void;
    index?: number;
    children: (source?: VectorSource) => ReactNode | ReactNode[];
};
interface ClusterLayerProps extends LayerProps {
    clusterOptions?: Options$1;
}

declare const Layer: ({ children, onClick }: LayerProps) => React.JSX.Element;

declare const ClusterLayer: ({ children, clusterOptions }: ClusterLayerProps) => React.JSX.Element;

type OverlayProps = {
    coordinate?: Coordinate$1;
    children: ReactElement;
};

declare const Overlay: ({ children, coordinate }: OverlayProps) => React.JSX.Element;

export { ClusterLayer, Layer, Marker, Map as OpenLayers, Overlay };
