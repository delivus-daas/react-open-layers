import { Feature, Map, View } from "ol";
import Geolocation from "ol/Geolocation";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { Point } from "ol/geom";
import { GeolocationType } from "./geolocation.type";
import { useEffect, useRef } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { EFeatureName } from "../map.type";

export function useGeolocation(
  map?: Map,
  showGeolocation?: boolean,
  options?: GeolocationType
) {
  const geolocationRef = useRef<any>();
  const layerRef = useRef<any>();
  const featureRef = useRef<any>();
  const changeListener = useRef<any>();
  const errorListener = useRef<any>();
  const animatedToLocation = useRef(false);
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

  const addListener = (geolocation: Geolocation, view: View) => {
    console.log("geo addListener");
    if (geolocation) {
      // handle geolocation error.
      errorListener.current = geolocation.on("error", function (error) {
        console.log("geolocation error", error);
        animatedToLocation.current = false;
        options?.onError && options?.onError(error);
      });

      changeListener.current = geolocation.on("change:position", function () {
        const coordinates = geolocationRef.current.getPosition();
        options?.onChangePosition && options?.onChangePosition(coordinates);
        if (
          view &&
          (options?.trackGeolocation || !animatedToLocation.current)
        ) {
          view.animate({
            center: coordinates,
            duration: 250,
          });
          animatedToLocation.current = true;
        }
        if (featureRef.current && coordinates)
          featureRef.current.setGeometry(new Point(coordinates));
      });
    }
  };

  const removeListener = (geolocation: Geolocation) => {
    console.log("geo removeListener");
    if (geolocation) {
      geolocation.setTracking(false);
      changeListener.current &&
        geolocation.removeChangeListener(
          "change:position",
          changeListener.current
        );
      errorListener.current &&
        geolocation.removeChangeListener("error", errorListener.current);
    }
  };

  const createGeolocation = (map: Map) => {
    console.log("geo createGeolocation");
    geolocationRef.current = new Geolocation({
      trackingOptions: {
        enableHighAccuracy: true,
      },
      tracking: true,
      projection: map.getView().getProjection(),
    });
    featureRef.current = new Feature();
    featureRef.current.setStyle(
      options?.positionStyle ||
        defaultPositionStyle(options?.fillColor, options?.strokeColor)
    );

    layerRef.current = new VectorLayer({
      source: new VectorSource({ features: [featureRef.current] }),
      opacity: 5,
    });
    layerRef.current.set("name", EFeatureName.geo);

    layerRef.current && map.addLayer(layerRef.current);
    addListener(geolocationRef.current, map.getView());
  };

  useEffect(() => {
    animatedToLocation.current = false;
    if (map) {
      if (showGeolocation) {
        createGeolocation(map);
      } else {
        layerRef.current && map.removeLayer(layerRef.current);
        removeListener(geolocationRef.current);
      }
    }

    return () => {
      if (map) {
        layerRef.current && map.removeLayer(layerRef.current);
        removeListener(geolocationRef.current);
      }
    };

  }, [map, showGeolocation]);
}
