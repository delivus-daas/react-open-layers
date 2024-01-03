import React, { useEffect, useRef } from "react";
import { Cluster } from "ol/source";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import { EFeatureName } from "../map.type";
import CircleStyle from "ol/style/Circle";
import { ClusterLayerProps } from "./cluster.type";
import VectorSource from "ol/source/Vector";
import { useMap } from "../OpenLayers";
import { Feature } from "ol";
// @ts-ignore
import marker from "../assets/marker.png";
import { Options } from "ol/style/Icon";
import { fromLonLat } from "ol/proj";
import { Point } from "ol/geom";
import { PointProps } from "../point/point.type";

export const ClusterLayer = ({
  points,
  clusterOptions = {},
  options = { zIndex: 10 },
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
      source.current = new VectorSource();

      let clusterSource = new Cluster({
        distance: 10,
        minDistance: 10,
        source: source.current,
        ...clusterOptions,
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
        ...options,
      });

      clusterLayer.current.set("name", EFeatureName.cluster);
      clusterLayer.current.set("opacity", 2);
      map.addLayer(clusterLayer.current);
    }
    return () => {
      resetLayers();
    };
  }, [map]);

  useEffect(() => {
    drawFeatures(points);
  }, [points, map]);

  const drawFeatures = (markers?: PointProps[]) => {
    let features: any = [];
    if (markers && markers?.length > 0) {
      features = markers.map(
        ({ iconOptions, coordinate, properties }, index) => {
          const coord = fromLonLat(coordinate);
          const feature = new Feature({
            geometry: new Point(coord),
          });
          properties && feature.setProperties(properties);

          const iconStyle = new Style({
            image: new Icon(iconOptions || defaultIconOptions),
          });
          feature.setStyle([iconStyle]);

          return feature;
        }
      );
    }
    if (source.current) {
      source.current.clear();
      source.current.addFeatures(features);
    }
  };

  return null;
};
