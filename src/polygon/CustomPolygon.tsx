import React, { useEffect, useRef } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { FeatureNames } from "../map.type";
import Polygon from 'ol/geom/Polygon.js';
import {PolygonProps} from "./polygon.type";
import { useMap } from "../OpenLayers";
import { Feature } from "ol";

const CustomPolygon = ({ coordinates, options = { zIndex: 10 } }: PolygonProps) => {
  const map = useMap();
  const source = useRef<any>();
  const vectorLayer = useRef<any>();

  useEffect(() => {
    if (map && !source.current) {
      source.current = new VectorSource();
      vectorLayer.current = new VectorLayer({
        source: source.current,
        ...options,
      });
      vectorLayer.current.set("name", FeatureNames.polygon);
      vectorLayer.current.set("opacity", 3);
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
    drawPolygons(coordinates);
  }, [coordinates, map]);

  const drawPolygons = (coordinates?: string[][]) => {
    let features: any = [];
    if (coordinates && coordinates.length > 0) {
      features = coordinates.map(
        (co, index) => {
          const coordinate = '[3143090.603086447, 9928281.393790578], [3283734.7351311715, 9928892.890016861], [3181003.3691158947, 9849398.380600277], [3143090.603086447, 9928281.393790578]';
          // const coordString = coordinates.join(",");
          var feature = new Feature(new Polygon(JSON.parse('[[' + coordinate + ']]')));
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

export default CustomPolygon;
