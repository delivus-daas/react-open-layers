import React, { useEffect, useRef } from "react";
import { Cluster } from "ol/source";
import {Fill, Icon, Stroke, Style, Text} from "ol/style";
import VectorLayer from "ol/layer/Vector";
import { FeatureNames } from "../map.type";
import CircleStyle from "ol/style/Circle";
import { LayerProps } from "./layer.type";
import VectorSource from "ol/source/Vector";
import { useMap } from "../Map";
// @ts-ignore
import marker from "../assets/marker.png";

declare global {
  interface Window {
    mouseOut: boolean;
  }
}

const ClusterLayer = ({ children, options }: LayerProps) => {
  const map = useMap();
  const source = useRef<VectorSource>();
  function defaultStyle(size: number) {
    return {
      image: new CircleStyle({
        radius: 12,
        stroke: new Stroke({
          color: "#fff",
        }),
        fill: new Fill({
          color: size===1?'#f00':"#3399CC",
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
          let style = styleCache[size];
          console.log("feature", size, features[size].getStyle())

          let markerIcon = new Style({
            image: new Icon(/** @type {module:ol/style/Icon~Options} */ ({
              crossOrigin: 'anonymous',
              src: marker
            }))
          });

          let clusterIcon = new Style(defaultStyle(size));

          if(style)
            return style;
          if (size > 1) {
            style = clusterIcon;
          }else {
            style = markerIcon;
          }
          styleCache[size] = style;
          return style;
        },
      });

      const styleCache: any = {};
      clusterLayer.set("name", FeatureNames.cluster);
      clusterLayer.set("opacity", 2);
      map.addLayer(clusterLayer);
    }
  }, [map]);

  return <>{children(source.current)}</>;
};

export default ClusterLayer;
