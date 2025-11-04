import { useEffect, useRef } from 'react';
import { Cluster, Source } from "ol/source";
import { Fill, Stroke, Style, Text } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import CircleStyle from "ol/style/Circle";
import VectorSource from "ol/source/Vector";
import { FeatureLike } from "ol/Feature";
import { click, pointerMove } from "ol/events/condition";
import { Select } from "ol/interaction";
import { SelectEvent } from "ol/interaction/Select";
import { Feature } from "ol";
import { ClusterLayerProps } from "./cluster.type";
import { Layer } from "ol/layer";

export const useCluster = ({
                             features,
                             map,
                             name = "cluster",
                             distance,
                             options = {},
                             clusterOptions = {},
                             layerOptions = { zIndex: 10 },
                             onClick,
                             onOver,
                             clusterStyle: clusterStyleProp,
                             overStyle,
                             clickStyle,
                             visible = true
                           }: ClusterLayerProps) => {
  const clusterLayer = useRef<Layer<Source>>();
  const clusterSource = useRef<Cluster>();
  const overInteraction = useRef<any>();
  const clickInteraction = useRef<any>();
  const styleCache: any = {};
  const defaultClusterStyle = (feature: FeatureLike) => {
    const size = feature.get("features").length;
    // Check cache
    console.log("clusterStyle2 features", size);
    if (!styleCache[size]) {
      styleCache[size] = new Style({
        image: new CircleStyle({
          radius: 10 + size,
          fill: new Fill({ color: '#333' }),
          stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
        text: new Text({
          text: size > 1 ? size.toString() : '1',
          fill: new Fill({ color: '#fff' }),
        }),
      });
    }

    return styleCache[size];
  };

  const clusterStyle = clusterStyleProp || defaultClusterStyle;
  const setSelectedStyle = (selected: Feature[], deselected: Feature[], style?: (f: Feature) => Style) => {
    selected && selected.forEach(s => s.setStyle(style ? style(s) : clusterStyle(s)));
    deselected && deselected.forEach(s => s.setStyle(clusterStyle(s)));
  }

  const addInteraction = () => {
    if (map && clusterLayer.current) {
      if (!overInteraction.current) {
        const select = new Select({
          condition: pointerMove,
          layers: [clusterLayer.current],
        });
        if (onOver || overStyle) {
          select.on("select", (event) => {
            setSelectedStyle(event.selected, event.deselected, overStyle)
            console.log("onOver", event.selected[0], event.deselected[0]);
            if (onOver) onOver(event.selected, event.deselected, event);
          });
          overInteraction.current = select;
          map.addInteraction(select);
        }
      }
      if (!clickInteraction.current) {
        if (onClick || clickStyle) {
          const select = new Select({
            condition: click,
            layers: [clusterLayer.current],
          });
          select.on("select", (event: SelectEvent) => {
            setSelectedStyle(event.selected, event.deselected, clickStyle)
            let features: Feature[] = event.selected[0].get("features");
            console.log("onClick", event.selected, features);
            if (onClick) onClick(event.selected, event.deselected, event);
          });
          clickInteraction.current = select;
          map.addInteraction(select);
        }
      }
      const interactions = map.getInteractions().getArray();
      console.log("cluster interactions", interactions);
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
    if (map && map.getLayers().getArray().length > 0 && clusterLayer.current) {
      map.removeLayer(clusterLayer.current);
    }
  };

  useEffect(() => {
    if (map && features) {
      clusterSource.current = new Cluster({
        distance,
        minDistance: 10,
        source: new VectorSource({ features, ...options }),
        ...clusterOptions,
      });

      clusterLayer.current = new VectorLayer({
        source: clusterSource.current,
        visible,
        style: clusterStyle,
        ...layerOptions
      })

      if (name) clusterLayer.current.set("name", name);
      map.addLayer(clusterLayer.current);
      console.log("useLayer map: ", map, "layer: ", clusterLayer.current)
      addInteraction();
      return () => {
        resetLayers();
        removeInteraction();
      };
    }
  }, [map, features]);

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
