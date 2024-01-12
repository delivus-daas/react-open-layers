import { Feature, Map } from "ol";
import Geolocation from "ol/Geolocation";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { Point } from "ol/geom";
import { GeolocationType } from "./geolocation.type";
import { useCallback, useEffect, useRef } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export function useGeolocation(
  map: Map,
  showMyLocation?: boolean,
  options?: GeolocationType
) {
  const geolocationRef = useRef<any>();
  const layerRef = useRef<any>();
  const defaultPositionStyle = (fillColor?: string, strokeColor?: string) => {
    return new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({
          color: fillColor || "#3399CC",
        }),
        stroke: new Stroke({
          color: strokeColor || "#fff",
          width: 2,
        }),
      }),
    });
  };

  const addListener = (geolocation: Geolocation, positionFeature: Feature) => {
    if (geolocation) {
      // handle geolocation error.
      geolocation.on("error", function (error) {});

      geolocation.on("change:accuracyGeometry", function () {});

      geolocation.on("change:position", function () {
        const coordinates = geolocationRef.current.getPosition();
        if (positionFeature)
          positionFeature.setGeometry(
            coordinates ? new Point(coordinates) : undefined
          );
      });
    }
  };

  const addLayer = useCallback(() => {
    if (layerRef.current) removeLayer();
    const positionFeature = new Feature();

    positionFeature.setStyle(
      options?.positionStyle ||
        defaultPositionStyle(options?.fillColor, options?.strokeColor)
    );
    layerRef.current = new VectorLayer({
      source: new VectorSource({
        features: [positionFeature],
      }),
    });
    geolocationRef.current = new Geolocation({
      // enableHighAccuracy must be set to true to have the heading value.
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: map.getView().getProjection(),
    });
    addListener(geolocationRef.current, positionFeature);
  }, []);

  const removeLayer = useCallback(() => {
    if (map) {
      layerRef.current && map.removeLayer(layerRef.current);
    }
  }, []);

  useEffect(() => {
    if (map) {
      if (showMyLocation) {
        addLayer();
      } else {
        removeLayer();
      }
    }
    return () => {
      removeLayer();
    };
  }, [map, showMyLocation]);
}
