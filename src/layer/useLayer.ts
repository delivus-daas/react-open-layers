import { useEffect, useRef } from 'react';
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature, MapBrowserEvent } from "ol";
import { FeatureLike } from "ol/Feature";
import { LayerProps } from "./layer.type";
import { Layer } from "ol/layer";
import { Source } from "ol/source";

export const useLayer = ({
                           map,
                           options = {},
                           layerOptions = {},
                           name,
                           features,
                           onClick,
                           onOver,
                           clickStyle,
                           overStyle,
                           style,
                           visible,
                         }: LayerProps) => {
  const source = useRef<VectorSource>();
  const vertorLayer = useRef<Layer<Source>>();
  let highlighted: Feature | null = null;

  const addInteraction = () => {
    if (map) {
      if (onOver || overStyle)
        map.on('pointermove', function (e: MapBrowserEvent<any>) {
            map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
              if (!layer || layer?.get("name") !== vertorLayer.current?.get("name") || feature === highlighted) return;
              if (onOver) onOver(feature, highlighted as FeatureLike, e);
              if (overStyle) {
                if (highlighted) {
                  highlighted.setStyle(undefined);
                  highlighted = null;
                }
                highlighted = feature as Feature;
                highlighted.setStyle(overStyle(highlighted));
              }
            });
          }
        );

      if (onClick || clickStyle)
        map.on('singleclick', function (e: MapBrowserEvent<any>) {
          map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
            if (!layer || layer?.get("name") !== vertorLayer.current?.get("name")) return;
            if (onClick) onClick(feature, highlighted as FeatureLike, e);
            if (clickStyle) {
              if (highlighted) {
                highlighted.setStyle(undefined);
                highlighted = null;
              }
              highlighted = feature as Feature;
              highlighted.setStyle(clickStyle(highlighted));
            }
            return true; // stop searching further features
          });
        });
    }
  };

  const resetLayers = () => {
    if (map && map.getLayers().getArray().length > 0 && vertorLayer.current) {
      map.removeLayer(vertorLayer.current);
    }
  };

  useEffect(() => {
    if (map) {
      source.current = new VectorSource(options);
      vertorLayer.current = new VectorLayer({
        source: source.current,
        zIndex: 11,
        visible,
        style,
        ...layerOptions
      });
      if (name) vertorLayer.current.set("name", name);
      map.addLayer(vertorLayer.current);
      console.log("✅ Layer is ready name:" + name);
      addInteraction();
      return () => {
        resetLayers();
      };
    }
  }, [map]);

  useEffect(() => {
    if (source.current) {
      console.log("useLayer", source.current, features)
      source.current.clear();
      if (features) source.current.addFeatures(features);
    }
  }, [features]);

  useEffect(() => {
    if (vertorLayer.current) {
      vertorLayer.current.setVisible(!!visible);
    }
  }, [visible]);
};
