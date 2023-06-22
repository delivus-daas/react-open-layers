import React, { forwardRef, useEffect, useRef } from "react";
import * as ol from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import "./index.css";
import { transform } from "ol/proj";
import {MapContextType, OpenLayersProps} from "./map.type";
import {Map} from "ol";

declare global {
  interface Window {
    mouseOut: boolean;
  }
}
const MapContext = React.createContext<MapContextType>({});
const OpenLayersMap = forwardRef(
  (
    {
      initialCenter = [126.83, 37.57],
      minZoom = 5,
      maxZoom = 21,
      initialZoom = 10,
      clusterEnabled,
      className,
      children,
      onClickMap,
      onClickFeature,
      onMouseOut,
      onMouseOver,
    }: OpenLayersProps,
    ref
  ) => {
    const mapRef = useRef<any>();
    const mapElement = useRef<any>();

    useEffect(() => {
      if (mapElement.current && !mapRef.current) {
        var layer = new TileLayer({
          source: new OSM(),
          className: "bw",
        });
        layer.set("name", "rasterLayer");

        var center = initialCenter? transform(initialCenter, "EPSG:4326", "EPSG:3857"): undefined;

        var view = new ol.View({
          center: center,
          zoom: initialZoom,
          maxZoom,
          minZoom,
        });

        mapRef.current = new ol.Map({
          target: mapElement.current,
          layers: [layer],
          view: view,
        });

        mapRef.current.on("singleclick", function (event: any) {
          event.stopPropagation();
          if (mapRef.current) {
            const features = mapRef.current.getFeaturesAtPixel(event.pixel);
            if (features.length > 0) {
              onClickFeature && onClickFeature(features);
            } else {
              !!onClickMap && onClickMap();
            }
          }
        });

        mapRef.current.on("pointermove", function (event: any) {
          event.stopPropagation();
          if (mapRef.current) {
            const features = mapRef.current.getFeaturesAtPixel(event.pixel);
            if (features.length > 0) {
              onMouseOver && onMouseOver(features);
            } else {
              !!onMouseOut && onMouseOut();
            }
          }
        });
      }
    }, [mapElement, mapRef]);

    return (
        <MapContext.Provider value={{map: mapRef.current, clusterEnabled}}>
          <div ref={mapElement} className={"map " + className}>
            {children}
          </div>
        </MapContext.Provider>
    );
  }
);

export default OpenLayersMap;
export const useMap = () => React.useContext(MapContext)
