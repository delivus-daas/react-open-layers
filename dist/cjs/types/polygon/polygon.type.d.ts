import { ReactNode } from "react";
import VectorSource from "ol/source/Vector";
import { Geometry } from "ol/geom";
import { Feature } from "ol";
import { Options } from "ol/layer/BaseVector";
import { Coordinate } from "ol/coordinate";
import { StyleLike } from "ol/style/Style";
export type PolygonProps = {
    coordinates: Array<Coordinate>;
    color: string;
};
export type PolygonLayerProps = {
    polygons: Array<PolygonProps>;
    options?: Options<any>;
    polygonStyle?: StyleLike;
    onClick?: (features: Feature<Geometry>[], event: any) => void;
    index?: number;
    children?: (source?: VectorSource) => ReactNode | ReactNode[];
};
