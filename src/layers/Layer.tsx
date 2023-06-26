import React, { useEffect, useRef } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { FeatureNames } from "../map.type";
import { LayerProps } from "./layer.type";
import { useMap } from "../Map";

declare global {
  interface Window {
    mouseOut: boolean;
  }
}

const Layer = ({ children }: LayerProps) => {
  const map = useMap();
  const source = useRef<VectorSource>();

  useEffect(() => {
    console.log("drawMrker", map);
    if (map && !source.current) {
      source.current = new VectorSource();
      const vectorLayer = new VectorLayer({
        source: source.current,
      });
      vectorLayer.set("name", FeatureNames.marker);
      vectorLayer.set("opacity", 2);
      map.getLayers().insertAt(1, vectorLayer);
    }
  }, [map]);

  return <>{children(source.current)}</>;
};

export default Layer;
