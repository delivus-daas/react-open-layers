import React, { forwardRef, useEffect } from "react";
import { fromLonLat } from "ol/proj";
import { MarkerProps } from "./marker.type";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { Icon, Style } from "ol/style";
import { Options } from "ol/style/Icon";
// @ts-ignore
import markerIcon from "../assets/marker.png";

declare global {
  interface Window {
    mouseOut: boolean;
  }
}

const Marker = forwardRef(
  (
    { coordinate, properties, index, iconOptions, source }: MarkerProps<any>,
    ref
  ) => {
    const defaultIconOptions: Options = {
      src: markerIcon,
      scale: 0.1,
    };

    useEffect(() => {
      if (source && !source.getFeatureById(index + 1)) {
        const coord = fromLonLat([coordinate.longitude, coordinate.latitude]);
        const feature = new Feature({
          geometry: new Point(coord),
        });
        properties && feature.setProperties(properties);

        const iconStyle = new Style({
          image: new Icon(iconOptions || defaultIconOptions),
        });
        feature.setStyle([iconStyle]);

        source?.addFeature(feature);

        return () => {
          source?.removeFeature(feature);
        };
      }
    }, [coordinate, source]);

    return null;
  }
);

export default Marker;
