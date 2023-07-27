import React, { useEffect, useRef } from "react";
import { Cluster } from "ol/source";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import { FeatureNames } from "../map.type";
import CircleStyle from "ol/style/Circle";
import { ClusterLayerProps } from "./layer.type";
import VectorSource from "ol/source/Vector";
import { useMap } from "../Map";
import { Feature } from "ol";
// @ts-ignore
import marker from "../assets/marker.png";
import { Options } from "ol/style/Icon";
import { FeatureLike } from "ol/Feature";
import { boundingExtent } from "ol/extent";

const ClusterLayer = ({
  children,
  fitOptions = { duration: 500, padding: [50, 50, 50, 50] },
  clusterOptions = {},
  clusterStyle,
  enableFitWhenClick,
  onClickMap,
  onClickFeatures,
  onMouseOutFeatures,
  onMouseOverFeatures,
}: ClusterLayerProps) => {
  const map = useMap();
  const source = useRef<any>();
  const clusterLayer = useRef<any>();
  const hoveredFeaturesRef = useRef<Feature[]>([]);

  const defaultIconOptions: Options = {
    src: marker,
    scale: 0.1,
  };

  function defaultClusterStyle(size: number, fill?: Array<number>) {
    return {
      image: new CircleStyle({
        radius: 12,
        stroke: new Stroke({
          color: "#fff",
        }),
        fill: new Fill({
          color: fill || "#3399CC",
        }),
      }),
      text: new Text({
        text: size.toString(),
        fill: new Fill({
          color: "#fff",
        }),
      }),
    };
  }

  useEffect(() => {
    if (map && !source.current) {
      source.current = new VectorSource();

      let clusterSource = new Cluster({
        distance: 10,
        minDistance: 10,
        source: source.current,
      });

      clusterLayer.current = new VectorLayer({
        source: clusterSource,
        style: function (feature: any, resolution: number) {
          const features = feature.get("features");
          const size = features?.length;
          let style = null;
          if (size > 0) {
            style = features[0].getStyle();
            console.log("feature", size, style[0]?.image_);
            if (size > 1) {
              style = new Style(
                clusterStyle
                  ? clusterStyle(resolution, size, style[0]?.image_?.color_)
                  : defaultClusterStyle(size, style[0]?.image_?.color_)
              );
            }
            return style;
          }
          return null;
        },
        ...clusterOptions,
      });

      clusterLayer.current.set("name", FeatureNames.cluster);
      clusterLayer.current.set("opacity", 2);
      map.addLayer(clusterLayer.current);

      addOnClickListener(map);
      addOnMouseOverListener(map);
    }
    return () => {
      resetLayers();
    };
  }, [map]);

  const resetLayers = () => {
    if (map && map.getLayers().getArray().length > 0) {
      map.removeLayer(clusterLayer.current);
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
      event.stopPropagation();
      if (map) {
        const clickedFeatures = map.getFeaturesAtPixel(event.pixel);
        if (clickedFeatures?.length) {
          const features = clickedFeatures[0].get("features");
          if (features?.length > 0) {
            const coordinate = features[0].getGeometry().getCoordinates();
            onClickFeatures && onClickFeatures(features, coordinate);
            if (enableFitWhenClick) fitToCluster(features);
            return;
          }
        }
        !!onClickMap && onClickMap();
      }
    });
  }

  function addOnMouseOverListener(map: any) {
    map.on("pointermove", (event: any) => {
      if (map) {
        const hoveredFeatures = map.getFeaturesAtPixel(event.pixel);
        if (hoveredFeatures?.length) {
          const features = hoveredFeatures[0].get("features");
          if (features?.length) {
            hoveredFeaturesRef.current = features;
            onMouseOverFeatures && onMouseOverFeatures(features, event);
            return;
          }
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

export default ClusterLayer;
