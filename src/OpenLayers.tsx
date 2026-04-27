import React, { createContext, useEffect, useRef, useState, } from "react";
import * as ol from "ol";
import { View } from "ol";
import type { EventsKey } from "ol/events";
import TileLayer from "ol/layer/Tile";
import { unByKey } from "ol/Observable";
import { OSM } from "ol/source";
import { defaults as interactionDefaults } from "ol/interaction/defaults";
import "./index.css";
import { OpenLayersProps } from "./map.type";
import { ZoomSlider } from "ol/control";
import { useGeolocation } from "./geolocation/useGeolocation";

const MapContext = createContext<ol.Map | undefined>(undefined);
const OpenLayers =
  (
    {
      initialCenter,
      center,
      moveTolerance = 1,
      maxTilesLoading = 16,
      className,
      children,
      zoom,
      viewOptions = { zoom: 10, maxZoom: 21, minZoom: 5 },
      layers: layersProp,
      interactionOptions = {
        doubleClickZoom: true,
        shiftDragZoom: true,
        mouseWheelZoom: true,
        dragPan: true,
      },
      extent,
      fitOptions = { duration: 500, padding: [50, 50, 50, 50] },
      onInit,
      onDoubleClick,
      showZoom,
      zoomInStyle,
      zoomOutStyle,
      showZoomSlider,
      showGeolocation,
      geolocationOptions,
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
    useGeolocation(map, showGeolocation, geolocationOptions);

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

    useEffect(() => {
      const bodyStyles: any = document.body.style;
      if (!showZoom) {
        bodyStyles.setProperty("--zoom-visible", "hidden");
      } else {
        bodyStyles.setProperty("--zoom-visible", "visible");

        bodyStyles.setProperty("--zoomin-width", zoomInStyle?.width ?? "47px");
        bodyStyles.setProperty(
          "--zoomin-height",
          zoomInStyle?.height ?? "39px"
        );
        bodyStyles.setProperty(
          "--zoomin-backgroundColor",
          zoomInStyle?.backgroundColor ?? "white"
        );
        bodyStyles.setProperty(
          "--zoomin-bottom",
          zoomInStyle?.bottom ?? "69px"
        );
        bodyStyles.setProperty("--zoomin-top", zoomInStyle?.top ?? "inherit");
        bodyStyles.setProperty("--zoomin-right", zoomInStyle?.right ?? "20px");
        bodyStyles.setProperty("--zoomin-left", zoomInStyle?.left ?? "inherit");

        bodyStyles.setProperty(
          "--zoomout-width",
          zoomOutStyle?.width ?? "47px"
        );
        bodyStyles.setProperty(
          "--zoomout-height",
          zoomOutStyle?.height ?? "39px"
        );
        bodyStyles.setProperty(
          "--zoomout-backgroundColor",
          zoomOutStyle?.backgroundColor ?? "white"
        );
        bodyStyles.setProperty(
          "--zoomout-bottom",
          zoomOutStyle?.bottom ?? "29px"
        );
        bodyStyles.setProperty("--zoomout-top", zoomOutStyle?.top ?? "inherit");
        bodyStyles.setProperty(
          "--zoomout-right",
          zoomOutStyle?.right ?? "20px"
        );
        bodyStyles.setProperty(
          "--zoomout-left",
          zoomOutStyle?.left ?? "inherit"
        );
      }
    }, [showZoom, zoomInStyle, zoomOutStyle]);

    useEffect(() => {
      if (mapElement.current && !mapRef.current) {
        const layers = layersProp || [new TileLayer({ source: new OSM() })];
        if (viewOptions)

          viewRef.current = new ol.View({ center: initialCenter, ...viewOptions });
        mapRef.current = new ol.Map({
          target: mapElement.current,
          layers,
          interactions: interactionDefaults(interactionOptions),
          view: viewRef.current,
          moveTolerance: moveTolerance,
          maxTilesLoading: maxTilesLoading,
        });
        viewListenerKeysRef.current = addViewListeners(viewRef.current);
        mapListenerKeysRef.current = addListeners(mapRef.current);
        addController(mapRef.current);
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

    function addController(map: any) {
      if (map) {
        if (showZoomSlider) {
          const zoomSlider = new ZoomSlider();
          map.addControl(zoomSlider);
        }
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
        <div ref={mapElement} className={"map " + className}>
          {children}
        </div>
      </MapContext.Provider>
    );
  }

export default OpenLayers;
export const useMap = () => React.useContext(MapContext);
