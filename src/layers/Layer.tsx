import React, { useEffect, useRef } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { FeatureNames } from "../map.type";
import { LayerProps } from "./layer.type";
import { useMap } from "../Map";
import { Feature } from "ol";
import { FeatureLike } from "ol/Feature";
import { boundingExtent } from "ol/extent";

const Layer = ({
}: LayerProps) => {
  const map = useMap();
  const source = useRef<VectorSource>();
  const vectorLayer = useRef<any>();

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

  return null;
};

export default Layer;
