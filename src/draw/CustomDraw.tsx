import React, { useCallback, useEffect, useRef } from "react";
import { DrawProps } from "./draw.type";
import { useMap } from "../OpenLayers";
import { Draw } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { Vector } from "ol/layer";
import { Options } from "ol/interaction/Draw";

export const CustomDraw = ({
  onDrawEnd,
  onDrawAbort,
  onDrawStart,
  options = { type: "Polygon" },
}: DrawProps) => {
  const map = useMap();
  const drawRef = useRef<any>();
  const sourceRef = useRef<any>();
  const layerRef = useRef<any>();
  function addEventListener() {
    if (drawRef.current) {
      if (onDrawStart) {
        drawRef.current.on("drawstart", function (event: any) {
          const coordinate = event.feature.getGeometry().getFirstCoordinate();
          onDrawStart(coordinate, event);
        });
      }
      if (onDrawEnd) {
        drawRef.current.on("drawend", function (event: any) {
          const extents = event.feature.getGeometry().getExtent();
          onDrawEnd(event);
        });
      }
      if (onDrawAbort) {
        drawRef.current.on("drawabort", function (event: any) {
          const coordinate = event.feature.getGeometry().getFirstCoordinate();
          onDrawAbort(coordinate, event);
        });
      }
    }
  }
  const defaultDrawStyle = (feature: any) => {
    var geometry = feature.getGeometry();
    console.log("geometry", geometry.getType());
    switch (geometry.getType()) {
      case "LineString":
        return [
          new Style({
            stroke: new Stroke({
              color: "#FF008A",
              lineDash: [5, 5],
              width: 2,
            }),
          }),
        ];
      case "Point":
        return [
          new Style({
            image: new Circle({
              radius: 5,
              stroke: new Stroke({ color: "#FF008A" }),
              fill: new Fill({ color: "#FF008A" }),
            }),
          }),
        ];
      case "Polygon":
        return [
          new Style({
            stroke: new Stroke({
              color: "#FF008A",
              lineDash: [5, 5],
              width: 2,
            }),
            fill: new Fill({
              color: "#FF008A20",
            }),
          }),
        ];
      default:
        return undefined;
    }
  };

  const addLayer = useCallback((options: Options) => {
    if (drawRef.current) removeLayer();
    const { type, ...rest } = options;
    sourceRef.current = new VectorSource({ wrapX: false });
    layerRef.current = new Vector({
      source: sourceRef.current,
      style: defaultDrawStyle,
    });
    drawRef.current = new Draw({
      source: sourceRef.current,
      style: defaultDrawStyle,
      type,
      ...rest,
    });
    map.addLayer(layerRef.current);
    map.addInteraction(drawRef.current);
    addEventListener();
  }, []);

  const removeLayer = useCallback(() => {
    if (map) {
      drawRef.current && map.removeInteraction(drawRef.current);
      layerRef.current && map.removeLayer(layerRef.current);
    }
  }, []);

  useEffect(() => {
    if (map) {
      if (options) {
        console.log("drawer", options, drawRef.current);
        if (!!drawRef.current) {
          removeLayer();
        }
        addLayer(options);
      } else {
        removeLayer();
      }
    }
    return () => {
      removeLayer();
    };
  }, [map, options]);

  return null;
};
