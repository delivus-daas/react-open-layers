import React, { createContext, useEffect, useRef, useState, } from "react";
import * as ol from "ol";
import { View } from "ol";
import type { EventsKey } from "ol/events";
import TileLayer from "ol/layer/Tile";
import { unByKey } from "ol/Observable";
import { OSM } from "ol/source";
import DragRotateAndZoom from 'ol/interaction/DragRotateAndZoom.js';
import { defaults as interactionDefaults } from "ol/interaction/defaults";
import "./index.css";
import { OpenLayersProps } from "./map.type";
import { ZoomSlider } from "ol/control";

const MapContext = createContext<ol.Map | undefined>(undefined);

type MapCssVariables = React.CSSProperties & Record<string, string>;

const OpenLayers =
  (
    {
      initialCenter,
      initialViewOptions = { zoom: 10, maxZoom: 21, minZoom: 5 },
      initialLayers: initialLayersProp,
      initialInteractionOptions,
      center,
      moveTolerance = 1,
      maxTilesLoading = 16,
      className,
      children,
      zoom,
      extent,
      fitOptions = { duration: 500, padding: [50, 50, 50, 50] },
      onInit,
      onDoubleClick,
      showZoom,
      zoomInStyle,
      zoomOutStyle,
      showZoomSlider,
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
    const zoomSliderRef = useRef<ZoomSlider>();
    const mapListenerKeysRef = useRef<EventsKey[]>([]);
    const viewListenerKeysRef = useRef<EventsKey[]>([]);

    useEffect(() => {
      if (center && mapRef.current)
        mapRef.current.getView().setCenter(center);
    }, [center]);

    useEffect(() => {
      if (zoom !== undefined && mapRef.current)
        mapRef.current.getView().animate({
          zoom,
          duration: 800
        });
    }, [zoom]);

    useEffect(() => {
      if (extent && viewRef.current)
        viewRef.current.fit(extent, fitOptions);
    }, [extent]);

    const mapStyle: MapCssVariables = {
      "--zoom-visible": showZoom ? "visible" : "hidden",
      "--zoomin-width": zoomInStyle?.width ?? "47px",
      "--zoomin-height": zoomInStyle?.height ?? "39px",
      "--zoomin-backgroundColor": zoomInStyle?.backgroundColor ?? "white",
      "--zoomin-bottom": zoomInStyle?.bottom ?? "69px",
      "--zoomin-top": zoomInStyle?.top ?? "inherit",
      "--zoomin-right": zoomInStyle?.right ?? "20px",
      "--zoomin-left": zoomInStyle?.left ?? "inherit",
      "--zoomout-width": zoomOutStyle?.width ?? "47px",
      "--zoomout-height": zoomOutStyle?.height ?? "39px",
      "--zoomout-backgroundColor": zoomOutStyle?.backgroundColor ?? "white",
      "--zoomout-bottom": zoomOutStyle?.bottom ?? "29px",
      "--zoomout-top": zoomOutStyle?.top ?? "inherit",
      "--zoomout-right": zoomOutStyle?.right ?? "20px",
      "--zoomout-left": zoomOutStyle?.left ?? "inherit",
    };

    useEffect(() => {
      if (mapElement.current && !mapRef.current) {
        const layers = initialLayersProp || [new TileLayer({ source: new OSM() })];
        if (initialViewOptions)

          viewRef.current = new ol.View({
            center: initialCenter,
            ...initialViewOptions,
          });
        mapRef.current = new ol.Map({
          target: mapElement.current,
          layers,

          interactions: interactionDefaults(initialInteractionOptions).extend([new DragRotateAndZoom()]),
          view: viewRef.current,
          moveTolerance: moveTolerance,
          maxTilesLoading: maxTilesLoading,
        });
        viewListenerKeysRef.current = addViewListeners(viewRef.current);
        mapListenerKeysRef.current = addListeners(mapRef.current);
        addZoomController(mapRef.current);
        setMap(mapRef.current);
        if (onInit) onInit(mapRef.current);
      }
      return () => {
        unByKey(mapListenerKeysRef.current);
        unByKey(viewListenerKeysRef.current);
        mapListenerKeysRef.current = [];
        viewListenerKeysRef.current = [];

        if (mapRef.current) {
          removeZoomController(mapRef.current);
          mapRef.current.setTarget(undefined);
          mapRef.current = undefined;
        }

        viewRef.current = undefined;
        setMap(undefined);
      };
    }, []);

    function addZoomController(map: ol.Map) {
      if (map) {
        if (showZoomSlider) {
          zoomSliderRef.current = new ZoomSlider();
          map.addControl(zoomSliderRef.current);
        }
      }
    }

    function removeZoomController(map: ol.Map) {
      if (zoomSliderRef.current) {
        map.removeControl(zoomSliderRef.current);
        zoomSliderRef.current = undefined;
      }
    }

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
        <div ref={mapElement} className={"map " + className} style={mapStyle}>
          {children}
        </div>
      </MapContext.Provider>
    );
  }

export default OpenLayers;
export const useMap = () => React.useContext(MapContext);
