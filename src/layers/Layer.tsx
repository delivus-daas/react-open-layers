import React, { useEffect, useRef } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { FeatureNames } from "../map.type";
import { FeatureProps, LayerProps } from "./layer.type";
import { useMap } from "../Map";
import { Feature } from "ol";
import {fromLonLat} from "ol/proj";
import {Point} from "ol/geom";
import {Icon, Style} from "ol/style";
import {Options} from "ol/style/Icon";
// @ts-ignore
import marker from "../assets/marker.png";

const Layer = ({features
}: LayerProps) => {
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
      });
      vectorLayer.current.set("name", FeatureNames.marker);
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
    drawFeatures(features);
  }, [features]);

  const drawFeatures = (markers?: FeatureProps[]) => {
    if (markers && markers.length > 0) {
      let features: any = [];
      features = markers.map(
          ({ iconOptions, coordinate, properties }, index) => {
            const coord = fromLonLat([coordinate.longitude, coordinate.latitude]);
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
      if (source.current) {
        source.current.clear();
        source.current.addFeatures(features);
      }
    }
  };

  return null;
};

export default Layer;
