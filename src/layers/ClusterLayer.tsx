import React, { useEffect, useRef } from "react";
import { Cluster } from "ol/source";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import { FeatureNames } from "../map.type";
import CircleStyle from "ol/style/Circle";
import { ClusterLayerProps } from "./layer.type";
import VectorSource from "ol/source/Vector";
import { useMap } from "../Map";
import { MarkerProps } from "../marker/marker.type";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
// @ts-ignore
import marker from "../assets/marker.png";
import {Options} from "ol/style/Icon";

const ClusterLayer = ({ children, clusterOptions = {}, clusterStyle }: ClusterLayerProps) => {
  const map = useMap();
  const source = useRef<any>();
  const clusterLayer = useRef<any>();

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
    if (map) {
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
          let style = null;
          if (size > 0) {
            style = features[0].getStyle();
            console.log("feature", size, style[0]?.image_);
            if (size > 1) {
              style = new Style(
                  clusterStyle? clusterStyle(resolution, size, style[0]?.image_?.color_) : defaultClusterStyle(size, style[0]?.image_?.color_)
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

  const drawFeatures = (markers?: MarkerProps[]) => {
    console.log('drawFeatures')
    let features: any = [];
    if (markers && markers?.length > 0) {
      features = markers.map(({iconOptions, coordinate, properties}, index) => {
        const coord = fromLonLat([coordinate.longitude, coordinate.latitude]);
        const feature = new Feature({
          geometry: new Point(coord),
        });
        properties && feature.setProperties(properties);

        const iconStyle = new Style({
          image: new Icon(iconOptions || defaultIconOptions),
        });
        feature.setStyle([iconStyle]);
        return feature;
      });
    }
    return features;
  };

  return (<>{children(source.current)}</>);
};

export default ClusterLayer;
