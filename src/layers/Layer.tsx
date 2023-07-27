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
  children,
  fitOptions = { duration: 500, padding: [50, 50, 50, 50] },
  enableFitWhenClick,
  onClickMap,
  onClickFeatures,
  onMouseOutFeatures,
  onMouseOverFeatures,
}: LayerProps) => {
  const map = useMap();
  const source = useRef<VectorSource>();
  const vectorLayer = useRef<any>();
  const hoveredFeaturesRef = useRef<Feature[]>([]);

  useEffect(() => {
    if (map && !source.current) {
      source.current = new VectorSource();
      vectorLayer.current = new VectorLayer({
        source: source.current,
      });
      vectorLayer.current.set("name", FeatureNames.marker);
      vectorLayer.current.set("opacity", 2);
      map.addLayer(vectorLayer.current);

      addOnClickListener(map);
      addOnMouseOverListener(map);
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

  function fitToCluster(features: FeatureLike[]) {
    const extent = boundingExtent(
      features.map((r: any) => r.getGeometry().getCoordinates())
    );
    map.getView().fit(extent, fitOptions);
  }

  function addOnClickListener(map: any) {
    map.on("singleclick", function (event: any) {
      if (map) {
        let features: any = [];
        map.forEachFeatureAtPixel(event.pixel, function (
          feature: any,
          layer: any
        ) {
          console.log("handleClick 1", feature);
          features.push(feature);
        });
        event.stopPropagation();
        console.log("handleClick", features);

        if (features?.length > 0) {
          const coordinate = features[0].getGeometry().getCoordinates();
          onClickFeatures && onClickFeatures(features, coordinate);
          if (enableFitWhenClick) fitToCluster(features);
          return;
        } else {
          !!onClickMap && onClickMap();
        }
      }
    });
  }

  function addOnMouseOverListener(map: any) {
    map.on("pointermove", (event: any) => {
      if (map) {
        const hoveredFeatures = map.getFeaturesAtPixel(event.pixel);
        if (hoveredFeatures?.length) {
            hoveredFeaturesRef.current = hoveredFeatures;
            onMouseOverFeatures && onMouseOverFeatures(hoveredFeatures, event);
            return;
        }
        //if there are features hovered before, call onMouseOut event
        if (hoveredFeaturesRef.current?.length > 0) {
          hoveredFeaturesRef.current = [];
          onMouseOutFeatures && onMouseOutFeatures();
        }
      }
      event.preventDefault();
    });
  }

  return <>{children(source.current)}</>;
};

export default Layer;
