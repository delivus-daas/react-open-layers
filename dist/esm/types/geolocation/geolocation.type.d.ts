import { StyleLike } from "ol/style/Style";
export type GeolocationType = {
    fillColor?: string;
    strokeColor?: string;
    positionStyle?: StyleLike;
    trackGeolocation?: boolean;
};
