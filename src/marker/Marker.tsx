import React, { forwardRef, useEffect, useRef } from "react";
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
    { coordinate, properties, index, iconOptions, source }: MarkerProps,
    ref
  ) => {
    const featureRef = useRef<any>();
    const defaultIconOptions: Options = {
      src: markerIcon,
      scale: 0.1,
    };

    useEffect(() => {
      const coord = fromLonLat([coordinate.longitude, coordinate.latitude]);
      const feature = new Feature({
        geometry: new Point(coord),
      });
      properties && feature.setProperties(properties);

      const iconStyle = new Style({
        image: new Icon(iconOptions || defaultIconOptions),
      });
      feature.setStyle([iconStyle]);
      featureRef.current = feature;
    }, []);

    useEffect(() => {
      if (source && !source.getFeatureById(index)) {
        source?.addFeature(featureRef.current);
        return () => {
          source?.removeFeature(featureRef.current);
        };
      }
    }, [source]);

    useEffect(() => {
      featureRef.current && featureRef.current.setId(index);
    }, [index]);

    useEffect(() => {
      const coord = fromLonLat([coordinate.longitude, coordinate.latitude]);
      featureRef.current && featureRef.current.setGeometry(new Point(coord));
    }, [coordinate]);

    useEffect(() => {
      featureRef.current &&
        properties &&
        featureRef.current.setProperties(properties);
    }, [properties]);

    useEffect(() => {
      const iconStyle = new Style({
        image: new Icon(iconOptions || defaultIconOptions),
      });
      featureRef.current && featureRef.current.setStyle([iconStyle]);
    }, [iconOptions]);

    return null;
  }
);

export default Marker;
