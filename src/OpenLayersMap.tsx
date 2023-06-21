import React, {
  forwardRef,
  useEffect,
  useRef,
} from "react";
import * as ol from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import "./index.css";
import { transform } from "ol/proj";
import { OpenLayersProps } from "./map.type";

declare global {
  interface Window {
    mouseOut: boolean;
  }
}

const OpenLayersMap = forwardRef(
  (
    {
      initialCenter = [126.83, 37.57],
      minZoom = 5,
      maxZoom = 21,
      initialZoom = 10,
      className,
      children,
      onClickMap,
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

        var center = transform(initialCenter, "EPSG:4326", "EPSG:3857");

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

        mapRef.current.on("singleclick", () => {
          !!onClickMap && onClickMap();
        });
      }
    }, [mapElement, mapRef]);

    return (
      <div ref={mapElement} className={'map ' + className}>
        {children}
      </div>
    );
  }
);

export default OpenLayersMap;
