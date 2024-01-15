import { Feature, Map } from "ol";
import Geolocation from "ol/Geolocation";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { Point } from "ol/geom";
import { GeolocationType } from "./geolocation.type";
import { useCallback, useEffect, useRef } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { EFeatureName } from "../map.type";

export function useGeolocation(
  map: Map,
  showGeolocation?: boolean,
  options?: GeolocationType
) {
  const geolocationRef = useRef<any>();
  const layerRef = useRef<any>();
  const featureRef = useRef<any>();
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

  const addListener = (geolocation: Geolocation) => {
    if (geolocation) {
      // handle geolocation error.
      geolocation.on("error", function (error) {
        console.log("geolocation error", error);
      });

      geolocation.on("change:accuracyGeometry", function () {});

      geolocation.on("change:position", function () {
        const coordinates = geolocationRef.current.getPosition();
        console.log(
          "geolocation change:position",
          coordinates,
          featureRef.current
        );
        if (options?.trackGeolocation) map.getView().setCenter(coordinates);
        if (featureRef.current)
          featureRef.current.setGeometry(
            coordinates ? new Point(coordinates) : undefined
          );
      });
    }
  };

  const addLayer = useCallback((map: Map) => {
    if (layerRef.current) removeLayer();
    featureRef.current = new Feature();

    featureRef.current.setStyle(
      options?.positionStyle ||
        defaultPositionStyle(options?.fillColor, options?.strokeColor)
    );
    layerRef.current = new VectorLayer({
      source: new VectorSource({
        features: [featureRef.current],
      }),
      opacity: 5,
    });

    layerRef.current.set("name", EFeatureName.geo);
    map.addLayer(layerRef.current);
    geolocationRef.current = new Geolocation({
      // enableHighAccuracy must be set to true to have the heading value.
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: map.getView().getProjection(),
    });
    geolocationRef.current.setTracking(true);
    addListener(geolocationRef.current);
  }, []);

  const removeLayer = useCallback(() => {
    if (map) {
      layerRef.current && map.removeLayer(layerRef.current);
    }
  }, []);

  useEffect(() => {
    if (map) {
      if (showGeolocation) {
        addLayer(map);
      } else {
        removeLayer();
      }
    }
    return () => {
      removeLayer();
    };
  }, [map, showGeolocation]);
}
