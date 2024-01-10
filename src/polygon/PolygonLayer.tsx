import React, { useEffect, useRef } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { EFeatureName } from "../map.type";
import Polygon from "ol/geom/Polygon.js";
import { PolygonLayerProps, PolygonProps } from "./polygon.type";
import { useMap } from "../OpenLayers";
import ol, { Feature } from "ol";
import { Fill, Stroke, Style, Text } from "ol/style";

function defaultPolygonStyle(color?: string, text?: string, opacity?: string) {
  opacity = opacity || "15";
  return [
    new Style({
      stroke: new Stroke({
        color: color || "#4200FF",
        width: 2.5,
      }),
      fill: new Fill({
        color: color ? color + opacity : "#4200FF" + opacity,
      }),
      text: new Text({
        font: "12px Calibri,sans-serif",
        fill: new Fill({ color: "#000" }),
        stroke: new Stroke({
          color: "#fff",
          width: 2,
        }),
        // get the text from the feature - `this` is ol.Feature
        // and show only under certain resolution
        text,
      }),
    }),
  ];
}
export const PolygonLayer = ({
  polygons,
  options = { zIndex: 10 },
  polygonStyle,
  showCode,
}: PolygonLayerProps) => {
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
      vectorLayer.current.set("name", EFeatureName.polygon);
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
    console.log("drawPolygons 1", polygons);
    drawPolygons(polygons);
  }, [polygons, map]);

  const drawPolygons = (polygons?: Array<PolygonProps>) => {
    let features: Feature[] = [];
    if (polygons && polygons.length > 0) {
      features = polygons.map(
        ({ coordinates, color, code, opacity }, index) => {
          const feature = new Feature(new Polygon([coordinates]));
          feature.setStyle(
            polygonStyle ||
              defaultPolygonStyle(color, showCode ? code : undefined, opacity)
          );
          return feature;
        }
      );
      console.log("drawPolygons", polygons);
    }
    if (source.current) {
      source.current.clear();
      source.current.addFeatures(features);
    }
  };

  return null;
};
