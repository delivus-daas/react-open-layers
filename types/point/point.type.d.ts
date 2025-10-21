import { ReactNode } from "react";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Options as IconOptions } from "ol/style/Icon";
import { Options } from "ol/layer/BaseVector";
import { Coordinate } from "ol/coordinate";
import { SelectEvent } from "ol/interaction/Select";
export interface PointProps {
    properties?: {
        [x: string]: any;
    };
    source?: VectorSource;
    iconOptions?: IconOptions;
    index: number;
    coordinate: Coordinate;
}
export type PointLayerProps = {
    layerOptions?: Options<any>;
    points?: PointProps[];
    onSourceCreated?: (source: VectorSource) => void;
    onClick?: (selected: Feature[], deselected: Feature[], event: SelectEvent) => void;
    onOver?: (selected: Feature[], deselected: Feature[], event: SelectEvent) => void;
    index?: number;
    children?: (source?: VectorSource) => ReactNode | ReactNode[];
};
