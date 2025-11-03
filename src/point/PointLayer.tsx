import React, { useEffect, useRef } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { EFeatureName } from "../map.type";
import { PointLayerProps, PointProps } from "./point.type";
import { useMap } from "../OpenLayers";
import { Feature } from "ol";
import { fromLonLat } from "ol/proj";
import { Point } from "ol/geom";
import { Icon, Style } from "ol/style";
import { Options } from "ol/style/Icon";
// @ts-ignore
import marker from "../assets/marker.png";

export const PointLayer = ({
  points,
  layerOptions = { zIndex: 10 },
}: PointLayerProps) => {
  const map = useMap();
  const source = useRef<any>();
  const vectorLayer = useRef<any>();
  const defaultIconOptions: Options = {
    src: marker,
    scale: 0.1,
  };

  useEffect(() => {
    if (map && !source.current) {
      source.current = new VectorSource();
      vectorLayer.current = new VectorLayer({
        source: source.current,
        ...layerOptions,
      });
      vectorLayer.current.set("name", EFeatureName.marker);
      vectorLayer.current.set("opacity", 2);
      map.addLayer(vectorLayer.current);
    }
    return () => {
      resetLayers();
    };
  }, [map]);

  const resetLayers = () => {
    if (map && map.getLayers().getArray().length > 0) {
      map.removeLayer(vectorLayer.current);
    }
  };

  useEffect(() => {
    drawPoints(points);
  }, [points, map]);

  const drawPoints = (points?: PointProps[]) => {
    let features: any = [];
    if (points && points.length > 0) {
      features = points.map(
        ({ iconOptions, coordinate, properties }, index) => {
          const coord = fromLonLat(coordinate);
          const feature = new Feature({
            geometry: new Point(coord),
          });
          properties && feature.setProperties(properties);

          const iconStyle = new Style({
            image: new Icon(iconOptions || defaultIconOptions),
          });
          feature.setStyle([iconStyle]);
          return feature;
        }
      );
    }
    if (source.current) {
      source.current.clear();
      source.current.addFeatures(features);
    }
  };

  return null;
};
