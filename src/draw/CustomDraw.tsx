import React, { useEffect, useRef } from "react";
import { DrawProps } from "./draw.type";
import { useMap } from "../OpenLayers";
import { Draw } from "ol/interaction";
import VectorSource from "ol/source/Vector";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { Vector } from "ol/layer";

export const CustomDraw = ({
  onDrawEnd,
  onDrawAbort,
  onDrawStart,
  options = {type: "Polygon"},
}: DrawProps) => {
  const map = useMap();
  const drawRef = useRef<any>();
  const layerRef = useRef<any>();
  const {type, ...restOption} = options;
  const defaultDrawStyle = (feature: any) => {
    var geometry = feature.getGeometry();
    console.log("geometry", geometry.getType());
    switch (geometry.getType()) {
      case "LineString":
        return [
          new Style({
            stroke: new Stroke({
              color: "#FF008A",
              lineDash: [5,5],
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
              lineDash: [5,5],
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

  useEffect(() => {
    if (map && !drawRef.current) {
      console.log("ondrawrender", drawRef.current, layerRef.current);
      const source = new VectorSource({ wrapX: false });
      layerRef.current = new Vector({ source, style: defaultDrawStyle });
      map.addLayer(layerRef.current);
      drawRef.current = new Draw({
        source,
        style: defaultDrawStyle,
        type,
        ...restOption
      });
      map.addInteraction(drawRef.current);
      addEventListener();
    }

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
            const coordinate = event.feature.getGeometry().getFirstCoordinate();
            console.log("onDrawEnd", coordinate);
            onDrawEnd(coordinate, event);
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
    return () => {
      map && map.removeInteraction(drawRef.current);
      map && map.removeLayer(drawRef.current);
    };
  }, [map]);

  return null;
};
