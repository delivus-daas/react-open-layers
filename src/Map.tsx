import React, {forwardRef, useEffect, useRef, useState} from "react";
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
}const MapContext = React.createContext<any>(undefined);
const Map = forwardRef(
  (
    {
      initialCenter = [126.83, 37.57],
      minZoom = 5,
      maxZoom = 21,
      zoom = 10,
      className,
      children,
      onClickMap,
      onClickFeature,
      onMouseOut,
      onMouseOver,
    }: OpenLayersProps,
    ref
  ) => {
    const [map, setMap] = useState<any>();
    const mapElement = useRef<any>();

    useEffect(() => {
      if (mapElement.current && !map) {
          const layer = new TileLayer({
              source: new OSM(),
              className: "bw",
            });
        layer.set("name", "rasterLayer");
        const center = initialCenter? transform(initialCenter, "EPSG:4326", "EPSG:3857"): undefined;

          const view = new ol.View({
          center,
          zoom,
          maxZoom,
          minZoom,
        });

        const map = new ol.Map({
          target: mapElement.current,
          layers: [layer],
          view: view,
        });
        setMap(map)

        map.on("singleclick", function (event: any) {
          event.stopPropagation();
          if (map) {
            const features = map.getFeaturesAtPixel(event.pixel);
            if (features.length > 0) {
              onClickFeature && onClickFeature(features);
            } else {
              !!onClickMap && onClickMap();
            }
          }
        });

        map.on("pointermove", function (event: any) {
          event.stopPropagation();
          if (map) {
            const features = map.getFeaturesAtPixel(event.pixel);
            if (features.length > 0) {
              onMouseOver && onMouseOver(features);
            } else {
              !!onMouseOut && onMouseOut();
            }
          }
        });
      }
    }, [mapElement]);

    return (
        <MapContext.Provider value={map}>
          <div ref={mapElement} className={"map " + className}>
            {children}
          </div>
        </MapContext.Provider>
    );
  }
);

export default Map;
export const useMap = () => React.useContext(MapContext)

