import React, { forwardRef, useEffect, useRef, useState } from "react";
import * as ol from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import "./index.css";
import { transform } from "ol/proj";
import { OpenLayersProps } from "./map.type";
import { FeatureLike } from "ol/Feature";
import { boundingExtent } from "ol/extent";

const MapContext = React.createContext<any>(undefined);
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
      onClickFeatures,
      onMouseOut,
      onMouseOver,
      enableFitWhenClick,
      fitOptions = { duration: 500, padding: [50, 50, 50, 50] },
    }: OpenLayersProps,
    ref
  ) => {
    const [map, setMap] = useState<any>();
    const mapElement = useRef<any>();
    const hoveredFeaturesRef = useRef<any>();

    useEffect(() => {
      if (mapElement.current && !map) {
        const layer = new TileLayer({
          source: new OSM(),
          className: "bw",
        });
        layer.set("name", "rasterLayer");
        const center = initialCenter
          ? transform(initialCenter, "EPSG:4326", "EPSG:3857")
          : undefined;

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
        addOnClickListener(map);

        addOnMouseOverListener(map);

        setMap(map);
      }
    }, [mapElement]);

    function addOnClickListener(map: any) {
      map.on("singleclick", function (event: any) {
        event.stopPropagation();
        if (map) {
          const clickedFeatures = map.getFeaturesAtPixel(event.pixel);
          if (clickedFeatures.length) {
            const features = clickedFeatures[0].get("features");
            if (features.length > 0) {
              onClickFeatures && onClickFeatures(features, event);
              if (enableFitWhenClick) fitToCluster(features);
              return;
            }
          }
          !!onClickMap && onClickMap();
        }
      });
    }

    function addOnMouseOverListener(map: any) {
      map.on("pointermove", (event: any) => {
        event.stopPropagation();
        if (map) {
          const hoveredFeatures = map.getFeaturesAtPixel(event.pixel);
          if (hoveredFeatures.length) {
            const features = hoveredFeatures[0].get("features");
            if (features.length) {
              hoveredFeaturesRef.current = hoveredFeatures;
              onMouseOver && onMouseOver(features, event);
              return;
            }
          }
          //if there are features hovered before, call onMouseOut event
          if(hoveredFeaturesRef.current.length>0) {
            hoveredFeaturesRef.current = [];
            onMouseOut && onMouseOut();
          }
        }
      });
    }

    function fitToCluster(features: FeatureLike[]) {
      const extent = boundingExtent(
        features.map((r: any) => r.getGeometry().getCoordinates())
      );
      map.getView().fit(extent, fitOptions);
    }

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
