import React, { useCallback, useEffect, useRef } from "react";
import { DrawProps } from "./draw.type";
import { useMap } from "../OpenLayers";
import { Draw } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { Vector } from "ol/layer";

export const CustomDraw = ({
  drawStyle,
  drawnStyle,
  onDrawEnd,
  onDrawAbort,
  onDrawStart,
  onSourceCreated,
  options = { type: "Polygon" },
}: DrawProps) => {
  const map = useMap();
  const drawRef = useRef<any>();
  const source = new VectorSource({ wrapX: false });
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
              lineDash: [5],
              width: 3.5,
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
              width: 3.5,
            }),
            fill: new Fill({
              color: "#FF008A50",
            }),
          }),
        ];
      default:
        return undefined;
    }
  };

  const addLayer = useCallback(() => {
    console.log("addLayer");
    const { type, ...rest } = options;
    layerRef.current = new Vector({
      source,
      style: drawStyle || defaultDrawStyle,
    });
    drawRef.current = new Draw({
      source,
      style: drawnStyle || defaultDrawStyle,
      type,
      ...rest,
    });
    onSourceCreated && onSourceCreated(source);
    map.addLayer(layerRef.current);
    map.addInteraction(drawRef.current);
  }, []);

  const removeLayer = useCallback(() => {
    console.log("add removeLayer");
    if (map) {
      drawRef.current && map.removeInteraction(drawRef.current);
      layerRef.current && map.removeLayer(layerRef.current);
    }
  }, []);

  useEffect(() => {
    if (map) {
      addLayer();
      addEventListener();
    }
    return () => {
      removeLayer();
    };
  }, [map]);

  return null;
};
