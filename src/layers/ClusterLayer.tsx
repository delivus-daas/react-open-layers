import React, { useEffect, useRef } from "react";
import { Cluster } from "ol/source";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import { FeatureNames } from "../map.type";
import CircleStyle from "ol/style/Circle";
import { ClusterLayerProps,  FeatureProps} from "./layer.type";
import VectorSource from "ol/source/Vector";
import { useMap } from "../Map";
import { Feature } from "ol";
// @ts-ignore
import marker from "../assets/marker.png";
import { Options } from "ol/style/Icon";
import { fromLonLat } from "ol/proj";
import { Point } from "ol/geom";

const ClusterLayer = ({
  features,
  clusterOptions = {},
  clusterStyle,
}: ClusterLayerProps) => {
  const map = useMap();
  const source = useRef<any>();
  const clusterLayer = useRef<any>();
  const styleCache: any = {};

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

  const resetLayers = () => {
    if (map && map.getLayers().getArray().length > 0) {
      map.removeLayer(clusterLayer.current);
    }
  };

  useEffect(() => {
    if (map && !source.current) {
      resetLayers();
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
          let style = styleCache[size];
          console.log("style", style);
          // if (style) {
          //   return style;
          // }
          if (size > 0) {
            style = features[0].getStyle();
            if (size > 1) {
              style = new Style(
                clusterStyle
                  ? clusterStyle(resolution, size, style[0]?.image_?.color_)
                  : defaultClusterStyle(size, style[0]?.image_?.color_)
              );
            }
            styleCache[size] = style;
            return style;
          }
          return null;
        },
        ...clusterOptions,
      });

      clusterLayer.current.set("name", FeatureNames.cluster);
      clusterLayer.current.set("opacity", 2);
      map.addLayer(clusterLayer.current);
    }
    return () => {
      resetLayers();
    };
  }, [map]);

  useEffect(() => {
    drawFeatures(features);
  }, [features]);

  const drawFeatures = (markers?: FeatureProps[]) => {
    if (markers && markers?.length > 0) {
      let features: any = [];
      features = markers.map(
        ({ iconOptions, coordinate, properties}, index) => {
          const coord = fromLonLat([coordinate.longitude, coordinate.latitude]);
          const feature = new Feature({
            geometry: new Point(coord),
            properties,
            style: [new Style({
              image: new Icon(iconOptions || defaultIconOptions),
            })],
          });
          return feature;
        }
      );
      if (source.current) {
        source.current.clear();
        source.current.addFeatures(features);
      }
    }
  };

  return null;
};

export default ClusterLayer;
