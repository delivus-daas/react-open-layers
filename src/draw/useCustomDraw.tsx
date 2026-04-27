import { useCallback, useEffect, useRef } from "react";
import { DrawProps } from "./draw.type";
import * as ol from "ol";
import { Draw } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { Layer, Vector } from "ol/layer";

export const useCustomDraw = ({
                                map,
                                drawStyle,
                                drawnStyle,
                                onDrawEnd,
                                onDrawAbort,
                                onDrawStart,
                                onSourceCreated,
                                options = { type: "Polygon" },
                                visible = true
                              }: DrawProps) => {
  const drawRef = useRef<Draw>();
  const layerRef = useRef<Layer>();

  function addEventListener() {
    if (drawRef.current) {
      if (onDrawStart) {
        drawRef.current.on("drawstart", onDrawStart);
      }
      if (onDrawEnd) {
        drawRef.current.on("drawend", onDrawEnd);
      }
      if (onDrawAbort) {
        drawRef.current.on("drawabort", onDrawAbort);
      }
    }
  }

  const defaultDrawStyle = (feature: any) => {
    var geometry = feature.getGeometry();
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

  const addLayer = useCallback((map: ol.Map) => {
    const { type, ...rest } = options;
    const source = new VectorSource({ wrapX: false });
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

  const removeListeners = useCallback(() => {
    if (drawRef.current) {
      if (onDrawStart) {
        drawRef.current.un("drawstart", onDrawStart);
      }
      if (onDrawEnd) {
        drawRef.current.un("drawend", onDrawEnd);
      }
      if (onDrawAbort) {
        drawRef.current.un("drawabort", onDrawAbort);
      }
    }
  }, []);

  const removeLayer = useCallback((map?: ol.Map) => {
    console.log("add removeLayer");
    if (map) {
      drawRef.current && map.removeInteraction(drawRef.current);
      layerRef.current && map.removeLayer(layerRef.current);
    }
  }, []);

  useEffect(() => {
    if (map && visible) {
      addLayer(map);
      addEventListener();
    }
    return () => {
      removeLayer(map);
      removeListeners();
    };
  }, [map, visible]);
};
