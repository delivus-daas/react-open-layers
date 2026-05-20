import React, { createContext, useEffect, useRef, useState, } from "react";
import * as ol from "ol";
import { View } from "ol";
import type { EventsKey } from "ol/events";
import TileLayer from "ol/layer/Tile";
import { unByKey } from "ol/Observable";
import { OSM } from "ol/source";
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom';
import { defaults as interactionDefaults } from "ol/interaction/defaults";
import "./index.css";
import { OpenLayersProps } from "./map.type";

const MapContext = createContext<ol.Map | undefined>(undefined);

const OpenLayers =
  (
    {
      initialViewOptions = { zoom: 10, maxZoom: 21, minZoom: 5 },
      initialLayers: initialLayersProp,
      initialInteractionOptions,
      center,
      moveTolerance = 1,
      maxTilesLoading = 16,
      className,
      children,
      extent,
      fitOptions = { duration: 500, padding: [50, 50, 50, 50] },
      onInit,
      onDoubleClick,
      onLoadStart,
      onLoadEnd,
      onMoveStart,
      onMoveEnd,
      onPointerDrag,
      onPostRender,
      onPostCompose,
      onPreCompose,
      onRenderComplete,
      onClick,
      onPointerMove,
      onResolutionChange,
    }: OpenLayersProps) => {
    const [map, setMap] = useState<ol.Map>();
    const mapElement = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<ol.Map>();
    const viewRef = useRef<View>();
    const mapListenerKeysRef = useRef<EventsKey[]>([]);
    const viewListenerKeysRef = useRef<EventsKey[]>([]);

    useEffect(() => {
      if (center && mapRef.current)
        mapRef.current.getView().setCenter(center);
    }, [center]);

    useEffect(() => {
      if (extent && viewRef.current)
        viewRef.current.fit(extent, fitOptions);
    }, [extent]);

    useEffect(() => {
      if (mapElement.current && !mapRef.current) {
        const layers = initialLayersProp || [new TileLayer({ source: new OSM() })];
        if (initialViewOptions)
          viewRef.current = new ol.View(initialViewOptions);
        mapRef.current = new ol.Map({
          target: mapElement.current,
          layers,
          interactions: interactionDefaults(initialInteractionOptions).extend([new MouseWheelZoom()]),
          view: viewRef.current,
          moveTolerance: moveTolerance,
          maxTilesLoading: maxTilesLoading,
        });
        viewListenerKeysRef.current = addViewListeners(viewRef.current);
        mapListenerKeysRef.current = addListeners(mapRef.current);
        setMap(mapRef.current);
        if (onInit) onInit(mapRef.current);
      }
      return () => {
        unByKey(mapListenerKeysRef.current);
        unByKey(viewListenerKeysRef.current);
        mapListenerKeysRef.current = [];
        viewListenerKeysRef.current = [];

        if (mapRef.current) {
          mapRef.current.setTarget(undefined);
          mapRef.current = undefined;
        }

        viewRef.current = undefined;
        setMap(undefined);
      };
    }, []);

    function addViewListeners(view?: View) {
      const listenerKeys: EventsKey[] = [];
      if (view) {
        if (onResolutionChange) {
          listenerKeys.push(
            view.on("change:resolution", () => {
              onResolutionChange(view);
            })
          );
        }
      }
      return listenerKeys;
    }

    function addListeners(map: ol.Map) {
      const listenerKeys: EventsKey[] = [];
      if (map) {
        if (onLoadStart)
          listenerKeys.push(map.on("loadstart", onLoadStart));

        if (onLoadEnd)
          listenerKeys.push(map.on("loadend", onLoadEnd));

        if (onPostRender)
          listenerKeys.push(map.on("postrender", onPostRender));


        if (onPreCompose)
          listenerKeys.push(map.on("precompose", onPreCompose));

        if (onPostCompose)
          listenerKeys.push(map.on("postcompose", onPostCompose));

        if (onRenderComplete)
          listenerKeys.push(map.on("rendercomplete", onRenderComplete));

        if (onMoveStart)
          listenerKeys.push(map.on("movestart", onMoveStart));

        if (onMoveEnd)
          listenerKeys.push(map.on("moveend", onMoveEnd));

        if (onDoubleClick)
          listenerKeys.push(map.on("dblclick", onDoubleClick));

        if (onClick)
          listenerKeys.push(map.on("singleclick", onClick));

        if (onPointerDrag)
          listenerKeys.push(map.on("pointerdrag", onPointerDrag));

        if (onPointerMove)
          listenerKeys.push(map.on("pointermove", onPointerMove));
      }
      return listenerKeys;
    }

    return (
      <MapContext.Provider value={map}>
        <div ref={mapElement} className={"map " + className}>
          {children}
        </div>
      </MapContext.Provider>
    );
  }

export default OpenLayers;
export const useMap = () => React.useContext(MapContext);
