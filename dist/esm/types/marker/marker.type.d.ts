import { Options } from "ol/style/Icon";
export type Coordinate = {
    latitude: number;
    longitude: number;
};
export type MarkerProps<T> = {
    clusterEnabled?: boolean;
    iconOptions?: Options;
    datum?: T;
    index: number;
    coordinate: Coordinate;
};
