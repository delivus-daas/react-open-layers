import React, { ReactNode } from 'react';
import { Options } from 'ol/style/Icon';
import { Feature } from 'ol';

type Coordinate = {
    latitude: number;
    longitude: number;
};
type MarkerProps<T> = {
    clusterEnabled?: boolean;
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

type OpenLayersProps = {
    clusterEnabled?: boolean;
    minZoom?: number;
    maxZoom?: number;
    initialZoom?: number;
    initialCenter?: Array<number>;
    className?: string;
    onMapBoundChanged?: (bounds: any) => void;
    children?: ReactNode | ReactNode[];
    onClickMap?: () => void;
    onMouseOver?: (feature: Feature[]) => void;
    onMouseOut?: () => void;
    onClickFeature?: (feature: Feature[]) => void;
};

declare global {
    interface Window {
        mouseOut: boolean;
    }
}
declare const OpenLayersMap: React.ForwardRefExoticComponent<OpenLayersProps & React.RefAttributes<unknown>>;

export { Marker, OpenLayersMap as OpenLayers };
