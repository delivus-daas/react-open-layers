import React, { useEffect, useRef } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { FeatureNames } from "../map.type";
import { LayerProps } from "./layer.type";
import { useMap } from "../Map";
import { boundingExtent } from "ol/extent";

const Layer = ({ children, onClick }: LayerProps) => {
  const map = useMap();
  const source = useRef<VectorSource>();

  useEffect(() => {
    if (map && !source.current) {
      source.current = new VectorSource();
      const vectorLayer = new VectorLayer({
        source: source.current,
      });
      vectorLayer.set("name", FeatureNames.marker);
      vectorLayer.set("opacity", 2);
      map.getLayers().insertAt(1, vectorLayer);

      handleClick(vectorLayer);
    }
  }, [map]);

  function handleClick(layer: VectorLayer<VectorSource>) {
    map.on("click", async (e: any) => {
      let clickLayerStatus = false;
      await layer.getFeatures(e.pixel).then((clickedFeatures: any) => {
        if (clickedFeatures?.length) {
          clickLayerStatus = true;
          // Get clustered Coordinates
          const features = clickedFeatures[0].get("features");
          if (features?.length > 1) {
            const extent = boundingExtent(
              features.map((r: any) => r.getGeometry().getCoordinates())
            );
            map.getView().fit(extent, {
              duration: 1000,
              padding: [50, 50, 50, 50],
            });
            if (onClick) {
              onClick(features, e);
            }
          }
        }
      });
    });
  }

  return <>{children(source.current)}</>;
};

export default Layer;
