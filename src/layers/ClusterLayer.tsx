import React, { useEffect, useRef } from "react";
import { Cluster } from "ol/source";
import {Fill, Stroke, Style, Text} from "ol/style";
import VectorLayer from "ol/layer/Vector";
import { FeatureNames } from "../map.type";
import CircleStyle from "ol/style/Circle";
import { LayerProps } from "./layer.type";
import VectorSource from "ol/source/Vector";
import { useMap } from "../Map";
import {boundingExtent} from "ol/extent";

declare global {
  interface Window {
    mouseOut: boolean;
  }
}

const ClusterLayer = ({ children, clusterOptions, onClick }: LayerProps) => {
  const map = useMap();
  const source = useRef<VectorSource>();
  function defaultStyle(size: number, fill?: Array<number>) {
    return {
      image: new CircleStyle({
        radius: 12,
        stroke: new Stroke({
          color: "#fff",
        }),
        fill: new Fill({
          color: fill || '#3399CC',
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

      const clusterLayer = new VectorLayer({
        source: clusterSource,
        style: function (feature: any) {
          const features = feature.get("features");
          const size = features.length;
          let style = null;
          if(size>0) {
            style = features[0].getStyle();
            console.log("feature", size, style[0]?.image_)
            if (size > 1) {
              style = new Style(clusterOptions || defaultStyle(size, style[0]?.image_?.color_));;
            }
            return style;
          }
          return null;
        },
      });

      handleClick(clusterLayer)
      clusterLayer.set("name", FeatureNames.cluster);
      clusterLayer.set("opacity", 2);
      map.addLayer(clusterLayer);
    }
  }, [map]);

  function handleClick (clusterLayer: VectorLayer<VectorSource>) {
    map.on("click", async (e: any) => {
      let clickLayerStatus = false;
      await clusterLayer
          .getFeatures(e.pixel)
          .then((clickedFeatures: any) => {
            if (clickedFeatures.length) {
              clickLayerStatus = true;
              // Get clustered Coordinates
              const features = clickedFeatures[0].get("features");
              if (features.length > 0) {
                const extent = boundingExtent(
                    features.map((r: any) =>
                        r.getGeometry().getCoordinates()
                    )
                );
                map.getView().fit(extent, {
                  duration: 1000,
                  padding: [50, 50, 50, 50],
                });
                if (onClick) {
                  onClick(features);
                }
              }
            }
          });
    });
  }

  return <>{children(source.current)}</>;
};

export default ClusterLayer;
