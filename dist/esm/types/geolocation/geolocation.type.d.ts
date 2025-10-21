import { StyleLike } from "ol/style/Style";
import { GeolocationError } from "ol/Geolocation";
import { Coordinate } from "ol/coordinate";
export type GeolocationType = {
    fillColor?: string;
    strokeColor?: string;
    positionStyle?: StyleLike;
    trackGeolocation?: boolean;
    onError?: (error: GeolocationError) => void;
    onChangePosition?: (coordinates: Coordinate) => void;
};
