import {useEffect, useRef} from 'react';
import {Cluster, Source} from "ol/source";
import {Fill, Stroke, Style, Text} from "ol/style";
import VectorLayer from "ol/layer/Vector";
import CircleStyle from "ol/style/Circle";
import VectorSource from "ol/source/Vector";
import {FeatureLike} from "ol/Feature";
import {click, pointerMove} from "ol/events/condition";
import {Select} from "ol/interaction";
import {SelectEvent} from "ol/interaction/Select";
import {Map} from "ol";
import {Layer} from "ol/layer";
import { ClusterLayerProps } from "./cluster.type";

export const useCluster = ({
                             features,
                             map,
                             name = "cluster",
                             distance,
                             options = {},
                             clusterOptions = {},
                             layerOptions = {zIndex: 10},
                             onClick,
                             onOver,
                             clusterStyle: clusterStyleProp,
                             overStyle,
                             zoom,
                             visible = true
                           }: ClusterLayerProps) => {
  const clusterLayer = useRef<Layer<Source>>();
  const source = useRef<VectorSource>();
  const clusterSource = useRef<Cluster>();
  const overInteraction = useRef<any>();
  const clickInteraction = useRef<any>();
  const styleCache: any = {};

  useEffect(() => {
    if (clusterSource.current && !!zoom) {
      let distance = 50; // default
      if (zoom >= 15) distance = 15; else if (zoom >= 13) distance = 20; else if (zoom >= 11) distance = 25; else if (zoom >= 9) distance = 30;
      clusterSource.current.setDistance(distance);
    }
  }, [zoom]);

  const defaultClusterStyle = (feature: FeatureLike, resolution: number) => {
    const size = feature.get("features").length;
    // Check cache
    console.log("clusterStyle2 features", size);
    if (!styleCache[size]) {
      styleCache[size] = new Style({
        image: new CircleStyle({
          radius: 10 + size, fill: new Fill({color: '#333'}), stroke: new Stroke({color: '#fff', width: 2}),
        }), text: new Text({
          text: size > 1 ? size.toString() : '1', fill: new Fill({color: '#fff'}),
        }),
      });
    }

    return styleCache[size];
  };

  const clusterStyle = clusterStyleProp || defaultClusterStyle;
  const addInteraction = (map: Map) => {
    if (map && clusterLayer.current) {
      if (onOver || overStyle) {
        if (!overInteraction.current) {
          const select = new Select({
            condition: pointerMove, layers: [clusterLayer.current], style: overStyle || clusterStyle
          });
          if (onOver) {
            select.on("select", (event) => {
              console.log("cluster onOver", event);
              onOver(event.selected, event.deselected, event);
            });
          }
          overInteraction.current = select;
          map.addInteraction(select);
        }
      }
      console.log("addInteractions", !clickInteraction.current, onClick);
      if (!clickInteraction.current) {
        if (onClick) {
          const select = new Select({
            condition: click, layers: [clusterLayer.current]
          });
          if (onClick) {
            select.on("select", (event: SelectEvent) => {
              onClick(event.selected, event.deselected, event);
            });
          }
          clickInteraction.current = select;
          map.addInteraction(select);
        }
      }
      const interactions = map.getInteractions()
        .getArray();
      console.log("cluster interactions", clickInteraction.current, overInteraction.current, interactions);
    }
  };

  const removeInteraction = (map: Map) => {
    if (map) {
      console.log("removeInteraction", map);
      if (clickInteraction.current) {
        map.removeInteraction(clickInteraction.current);
      }
      if (overInteraction.current) {
        map.removeInteraction(overInteraction.current);
      }
    }
  };

  const resetLayers = (map: Map) => {
    if (map && map.getLayers()
      .getArray().length > 0 && clusterLayer.current) {
      map.removeLayer(clusterLayer.current);
    }
  };

  useEffect(() => {
    if (!!map) {
      console.log("useCluster init")
      source.current = new VectorSource(options);
      clusterSource.current = new Cluster({
        distance, minDistance: 10, source: source.current, ...clusterOptions,
      });

      clusterLayer.current = new VectorLayer({
        source: clusterSource.current, visible, style: clusterStyle, ...layerOptions
      })

      if (name) clusterLayer.current.set("name", name);
      map.addLayer(clusterLayer.current);
      console.log("useLayer map: ", map, "layer: ", clusterLayer.current)
      addInteraction(map);
      return () => {
        resetLayers(map);
        removeInteraction(map);
      };
    }
  }, [map]);

  useEffect(() => {
    if (source.current) {
      source.current.clear();
      if (features.length > 0) source.current.addFeatures(features);
    }
  }, [features]);

  useEffect(() => {
    if (clusterLayer.current) {
      clusterLayer.current.setVisible(visible);
    }
  }, [visible]);

  useEffect(() => {
    if (clusterSource.current && distance) {
      clusterSource.current.setDistance(distance);
    }
  }, [distance]);
};
