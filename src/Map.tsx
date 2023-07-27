import React, { forwardRef, useEffect, useRef, useState } from "react";
import * as ol from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { defaults as interactionDefaults } from "ol/interaction/defaults";
import "./index.css";
import { transform } from "ol/proj";
import { OpenLayersProps } from "./map.type";

const MapContext = React.createContext<any>(undefined);
const Map = forwardRef(
  (
    {
      initialCenter = [126.83, 37.57],
      className,
      children,
      viewOptions = { zoom: 10, maxZoom: 21, minZoom: 5 },
      layerOptions = { source: new OSM() },
      interactionOptions = {
        doubleClickZoom: true,
        shiftDragZoom: true,
        mouseWheelZoom: true,
        dragPan: true,
      },
    }: OpenLayersProps,
    ref
  ) => {
    const [map, setMap] = useState<any>();
    const mapElement = useRef<any>();

    useEffect(() => {
      if (mapElement.current && !map) {
        const center = initialCenter
          ? transform(initialCenter, "EPSG:4326", "EPSG:3857")
          : undefined;

        const map = new ol.Map({
          target: mapElement.current,
          layers: [new TileLayer(layerOptions)],
          interactions: interactionDefaults(interactionOptions),
          view: new ol.View({ center, ...viewOptions }),
        });

        setMap(map);
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
export const useMap = () => React.useContext(MapContext);
