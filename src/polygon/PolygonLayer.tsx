import React, { useEffect, useRef } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { FeatureNames } from "../map.type";
import Polygon from 'ol/geom/Polygon.js';
import {PolygonLayerProps, PolygonProps} from "./polygon.type";
import { useMap } from "../OpenLayers";
import { Feature } from "ol";
import {Fill, Stroke, Style} from "ol/style";
import {fromLonLat} from "ol/proj";

function defaultPolygonStyle(color?: string) {
  return [
    new Style({
      stroke: new Stroke({
        color: color||'#4200FF',
        width: 2.5,
      }),
      fill: new Fill({
        color: color?color+'20':'#4200FF10',
      })
    }),
  ]
}
export const PolygonLayer = ({ polygons, options = { zIndex: 10 }, polygonStyle }: PolygonLayerProps) => {
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
    console.log("drawPolygons 1", polygons)
    drawPolygons(polygons);
  }, [polygons, map]);

  const drawPolygons = (polygons?: Array<PolygonProps>) => {
    if (polygons && polygons.length > 0) {
      const features = polygons.map(
        ({coordinates, color}, index) => {
          const feature = new Feature(new Polygon([coordinates]));
          feature.setStyle(polygonStyle||defaultPolygonStyle(color));
          return feature;
        }
      );
      console.log("drawPolygons", polygons)
      if (source.current && features.length>0) {
        source.current.clear();
        source.current.addFeatures(features);
      }
    }
  };

  return null;
};
