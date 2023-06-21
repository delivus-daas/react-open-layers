import React, { ReactNode } from 'react';

type OpenLayersProps = {
    minZoom?: number;
    maxZoom?: number;
    initialZoom?: number;
    initialCenter?: Array<number>;
    className?: string;
    onMapBoundChanged?: (bounds: any) => void;
    children?: ReactNode | ReactNode[] | boolean;
    onClickMap?: () => void;
};

declare global {
    interface Window {
        mouseOut: boolean;
    }
}
declare const OpenLayersMap: React.ForwardRefExoticComponent<OpenLayersProps & React.RefAttributes<unknown>>;

export { OpenLayersMap as OpenLayers };
