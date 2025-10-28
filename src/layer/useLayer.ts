import { useEffect, useRef } from 'react';
import VectorSource from "ol/source/Vector";
import { click, pointerMove } from "ol/events/condition";
import { Select } from "ol/interaction";
import { Feature } from "ol";
import VectorLayer from "ol/layer/Vector";
import { SelectEvent } from "ol/interaction/Select";
import { Style } from "ol/style";
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

  const setSelectedStyle = (selected: Feature[], deselected: Feature[], selectStyle?: (f: Feature) => Style) => {
    selected && selected.forEach(s => s.setStyle(selectStyle ? selectStyle(s) : style ? style(s) : undefined));
    deselected && deselected.forEach(s => s.setStyle(style ? style(s) : undefined));
  }

  const addInteraction = () => {
    if (map) {
      const select = new Select({
        condition: pointerMove,
        layers: [layer.current],
      });
      if (onOver || overStyle) {
        select.on("select", (event) => {
          setSelectedStyle(event.selected, event.deselected, overStyle)
          console.log("onOver", event.selected[0], event.deselected[0]);
          onOver && onOver(event.selected, event.deselected, event);
        });
        overInteraction.current = select;
        map.addInteraction(select);
      } else if (overInteraction.current) {
        map.removeInteraction(overInteraction.current);
      }
      if (onClick || clickStyle) {
        const select = new Select({
          condition: click,
          layers: [layer.current],
        });
        select.on("select", (event: SelectEvent) => {
          setSelectedStyle(event.selected, event.deselected, clickStyle)
          let features: Feature[] = event.selected[0].get("features");
          console.log("onClick", event.selected, features);
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
      map.removeLayer(layer.current);
      source.current = null;
    }
  };

  useEffect(() => {
    if (map) {
      if (!source.current && visible) {
        source.current = new VectorSource(options);
        layer.current = new VectorLayer({
          source: source.current,
          zIndex: 11,
          style,
          ...layerOptions
        });
        if (name) layer.current.set("name", name);
        map.addLayer(layer.current);
        console.log("layer use", map, layer.current)
        addInteraction();
      } else if (!visible) {
        resetLayers();
        removeInteraction();
      }
      return () => {
        resetLayers();
        removeInteraction();
      };
    }
  }, [map, visible])
};
