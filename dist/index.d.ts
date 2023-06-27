import React, { ReactNode } from 'react';
import { Options } from 'ol/style/Icon';
import VectorSource from 'ol/source/Vector';
import { ViewOptions } from 'ol/View';
import { FeatureLike } from 'ol/Feature';
import { Options as Options$1 } from 'ol/style/Style';

type Coordinate = {
    latitude: number;
    longitude: number;
};
type MarkerProps<T> = {
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
    initialCenter?: number[];
    className?: string;
    onMapBoundChanged?: (bounds: any) => void;
    children?: ReactNode | ReactNode[];
    onClickMap?: () => void;
    onMouseOver?: (feature: FeatureLike[]) => void;
    onMouseOut?: () => void;
    onClickFeature?: (feature: FeatureLike[]) => void;
}

declare global {
    interface Window {
        mouseOut: boolean;
    }
}
declare const Map: React.ForwardRefExoticComponent<OpenLayersProps & React.RefAttributes<unknown>>;

type LayerProps = {
    options?: Options$1;
    index?: number;
    children: (source?: VectorSource) => ReactNode | ReactNode[];
};

declare global {
    interface Window {
        mouseOut: boolean;
    }
}
declare const Layer: ({ children }: LayerProps) => React.JSX.Element;

declare global {
    interface Window {
        mouseOut: boolean;
    }
}
declare const ClusterLayer: ({ children, options }: LayerProps) => React.JSX.Element;

export { ClusterLayer, Layer, Marker, Map as OpenLayers };