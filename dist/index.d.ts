import React, { ReactNode, ReactElement } from 'react';
import VectorSource from 'ol/source/Vector';
import { Geometry } from 'ol/geom';
import { Feature } from 'ol';
import { Options as Options$1 } from 'ol/source/Cluster';
import { Options as Options$2 } from 'ol/style/Style';
import { Options as Options$3 } from 'ol/style/Icon';
import { Options } from 'ol/layer/BaseVector';
import { Coordinate as Coordinate$1 } from 'ol/coordinate';
import { Pixel } from 'ol/pixel';
import { Options as Options$4 } from 'ol/Overlay';
import { Options as Options$5 } from 'ol/control/Control';

declare const OpenLayers: React.FC;

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

export { ClusterLayer, Controller as Control, Layer, OpenLayers, CustomOverlay as Overlay };
