import { useEffect, useRef } from 'react';
import { Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { click, pointerMove } from "ol/events/condition";
import { Select } from "ol/interaction";
import { Feature } from "ol";
import { LayerProps } from "./layer.type";

export const useLayer = ({
                           map,
                           options = {},
                           layerOptions = {},
                           name,
                           onClick,
                           onOver,
                           clickStyle,
                           overStyle,
                           style,
                           visible,
                         }: LayerProps) => {
  const source = useRef<any>();
  const layer = useRef<any>();
  const overInteraction = useRef<any>();
  const clickInteraction = useRef<any>();

  const setSelectedStyle = (selected: Feature[], deselected: Feature[], selectStyle: (f: Feature) => Style) => {
    selected && selected.forEach(s => s.setStyle(selectStyle(s)));
    deselected && deselected.forEach(s => s.setStyle(style ? style(s) : undefined));
  }

  const addInteraction = () => {
    console.log("addInteraction name:", name, overInteraction.current);
    if (map) {
      if (!overInteraction.current) {
        const select = new Select({
          condition: pointerMove,
          layers: [layer.current],
        });
        console.log("addInteraction name:", name, onOver, overStyle);
        if (onOver || overStyle) {
          select.on("select", (event) => {
            if (overStyle) setSelectedStyle(event.selected, event.deselected, overStyle)
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
            layers: [layer.current],
          });
          select.on("select", (event) => {
            if (clickStyle) setSelectedStyle(event.selected, event.deselected, clickStyle)
            console.log("onClick", event.selected);
            if (onClick) onClick(event.selected, event.deselected, event);
          });
          clickInteraction.current = select;
          map.addInteraction(select);
        }
      }
      const interactions = map.getInteractions().getArray();
      console.log("layer interactions", interactions);
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
      map.removeLayer(layer.current);
    }
  };

  useEffect(() => {
    if (map) {
      source.current = new VectorSource(options);
      layer.current = new VectorLayer({
        source: source.current,
        zIndex: 11,
        visible,
        style,
        ...layerOptions
      });
      if (name) layer.current.set("name", name);
      map.addLayer(layer.current);
      console.log("✅ Layer is ready name:" + name);
      addInteraction();
      return () => {
        resetLayers();
        removeInteraction();
      };
    }
  }, [map])

  useEffect(() => {
    if (layer.current) {
      layer.current.setVisible(visible);
    }
  }, [visible]);
};
