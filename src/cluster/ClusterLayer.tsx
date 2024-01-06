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
import { FeatureLike } from "ol/Feature";
import { Select } from "ol/interaction";
import { click, pointerMove } from "ol/events/condition";
import {SelectEvent} from "ol/interaction/Select";

export const ClusterLayer = ({
  points,
  clusterOptions = {},
  options = { zIndex: 10 },
  onClick,
  onOver,
  clusterStyle,
}: ClusterLayerProps) => {
  const map = useMap();
  const source = useRef<any>();
  const clusterLayer = useRef<any>();
  const overInteraction = useRef<any>();
  const clickInteraction = useRef<any>();
  const styleCache: any = {};

  const defaultIconOptions: Options = {
    src: marker,
    scale: 0.1,
  };

  function defaultClusterStyle(size: number) {
    return new Style({
      image: new CircleStyle({
        radius: 12,
        stroke: new Stroke({
          color: "#fff",
        }),
        fill: new Fill({
          color: "#f00",
        }),
      }),
      text: new Text({
        text: size.toString(),
        fill: new Fill({
          color: "#fff",
        }),
      }),
    });
  }

  const addInteraction = () => {
    if (map) {
      if (onOver) {
        const select = new Select({
          condition: pointerMove,
          layers: [clusterLayer.current]
        });
        select.on("select", (event) => {
          console.log("onOver", event.selected);
          onOver && onOver(event.selected, event.deselected, event);
        });
        overInteraction.current = select;
        map.addInteraction(select);
      } else if (overInteraction.current) {
        map.removeInteraction(overInteraction.current);
      }
      if (onClick) {
        const select = new Select({
          condition: click,
          layers: [clusterLayer.current]
        });
        select.on("select", (event: SelectEvent) => {
          console.log("onClick", event.selected);
          onClick && onClick(event.selected, event.deselected, event);
        });
        clickInteraction.current = select;
        map.addInteraction(select);
      } else if (clickInteraction.current) {
        map.removeInteraction(clickInteraction.current);
      }
    }
  };
  const removeInteraction = () => {
    if (map) {
      if (clickInteraction.current) {
        map.removeInteraction(clickInteraction.current);
      }
      if (overInteraction.current) {
        map.removeInteraction(overInteraction.current);
      }
    }
  };

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
        style: function (feature: FeatureLike, resolution: number) {
          const features: Feature[] = feature.get("features");
          const size = features?.length;
          console.log("clusterStyle", feature, features, features[0].getStyle());
          if (size === 1) return features[0].getStyle();
          if (size > 1) {
            console.log("clusterStyle size>1", features, !!clusterStyle);
            if (clusterStyle) {
              return clusterStyle(resolution, size, features);
            }
            console.log("clusterStyle cahce", styleCache[size]);
            if (styleCache[size]) {
              return styleCache[size];
            }
            console.log("clusterStyle cahce", defaultClusterStyle(size));
            styleCache[size] = defaultClusterStyle(size);
            return styleCache[size];
          } //without feature no style;
        },
        ...options,
      });

      clusterLayer.current.set("name", EFeatureName.cluster);
      clusterLayer.current.set("opacity", 2);
      map.addLayer(clusterLayer.current);
      addInteraction();
    }
    return () => {
      resetLayers();
      removeInteraction();
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
