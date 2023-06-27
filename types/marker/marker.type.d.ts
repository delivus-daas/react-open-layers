import { Options } from "ol/style/Icon";
import VectorSource from "ol/source/Vector";
export type Coordinate = {
    latitude: number;
    longitude: number;
};
export type MarkerProps<T> = {
    source?: VectorSource;
    iconOptions?: Options;
    datum?: T;
    index: number;
    coordinate: Coordinate;
};