import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, } from "react";
import * as ol from "ol";
import { MapBrowserEvent, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { defaults as interactionDefaults } from "ol/interaction/defaults";
import "./index.css";
import { OpenLayersProps } from "./map.type";
import { FeatureLike } from "ol/Feature";
import { ZoomSlider } from "ol/control";
import { boundingExtent } from "ol/extent";
import { useGeolocation } from "./geolocation/useGeolocation";

const MapContext = React.createContext<any>(undefined);
const OpenLayers = forwardRef(
  (
    {
      initialCenter,
      center,
      moveTolerance = 1,
      maxTilesLoading = 16,
      className,
      children,
      viewOptions = { zoom: 10, maxZoom: 21, minZoom: 5 },
      layers: layersProp,
      interactionOptions = {
        doubleClickZoom: true,
        shiftDragZoom: true,
        mouseWheelZoom: true,
        dragPan: true,
      },
      fitOptions = { duration: 500, padding: [50, 50, 50, 50] },
      enableFitWhenClick,
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
      onPointerOut,
      onResolutionChange,
    }: OpenLayersProps,
    ref
  ) => {
    const [map, setMap] = useState<ol.Map>();
    const mapElement = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<ol.Map>();
    const viewRef = useRef<View>();
    useGeolocation(map, showGeolocation, geolocationOptions);

    useEffect(() => {
      if (center && mapRef.current)
        mapRef.current.getView().setCenter(center);
    }, [center]);

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
      console.log(
        "mapElement",
        mapElement.current,
        mapRef.current,
        mapElement.current && !mapRef.current
      );
      if (mapElement.current && !mapRef.current) {
        console.log("mapElement 1", mapElement.current);
        const layers = layersProp || [new TileLayer({ source: new OSM() })];
        if(viewOptions)

        viewRef.current = new ol.View({ center: initialCenter, ...viewOptions });
        mapRef.current = new ol.Map({
          target: mapElement.current,
          layers,
          interactions: interactionDefaults(interactionOptions),
          view: viewRef.current,
          moveTolerance: moveTolerance,
          maxTilesLoading: maxTilesLoading,
        });
        addViewListeners(viewRef.current);
        addListeners(mapRef.current);
        addController(mapRef.current);
        setMap(mapRef.current);
        if(onInit) onInit(mapRef.current);
      }
    }, []);

    function fitToFeatures(features: FeatureLike[]) {
      const extent = boundingExtent(
        features.map((r: any) => r.getGeometry().getCoordinates())
      );
      if (map)
        map.getView().fit(extent, fitOptions);
    }

    function addController(map: any) {
      if (map) {
        if (showZoomSlider) {
          const zoomSlider = new ZoomSlider();
          map.addControl(zoomSlider);
        }
      }
    }

    function addViewListeners(view?: View) {
      if (view) {
        onResolutionChange &&
        view.on("change:resolution", () => {
          onResolutionChange(view);
        });
      }
    }

    function addListeners(map: any) {
      if (map) {
        onLoadStart &&
        map.on("loadstart", function (event: ol.MapBrowserEvent<any>) {
          if (onLoadStart) {
            onLoadStart(event);
          }
        });

        onLoadEnd &&
        map.on("loadend", function (event: ol.MapBrowserEvent<any>) {
          if (onLoadEnd) {
            onLoadEnd(event);
          }
        });

        onPostRender &&
        map.on("postrender", function (event: ol.MapBrowserEvent<any>) {
          if (onPostRender) {
            onPostRender(event);
          }
        });

        onPreCompose &&
        map.on("precompose", function (event: ol.MapBrowserEvent<any>) {
          if (onPreCompose) {
            onPreCompose(event);
          }
        });

        onPostCompose &&
        map.on("postcompose", function (event: ol.MapBrowserEvent<any>) {
          if (onPostCompose) {
            onPostCompose(event);
          }
        });

        onRenderComplete &&
        map.on("rendercomplete", function (event: ol.MapBrowserEvent<any>) {
          if (onRenderComplete) {
            onRenderComplete(event);
          }
        });

        onMoveStart &&
        map.on("movestart", function (event: ol.MapBrowserEvent<any>) {
          if (onMoveStart) {
            onMoveStart(event);
          }
        });

        onMoveEnd &&
        map.on("moveend", function (event: ol.MapBrowserEvent<any>) {
          if (onMoveEnd) {
            onMoveEnd(event);
          }
        });

        if (onDoubleClick && mapRef.current)
          mapRef.current.on("dblclick", function (
            event: ol.MapBrowserEvent<any>
          ) {
            if (onDoubleClick) {
              const clickedFeatures = map.getFeaturesAtPixel(event.pixel);
              onDoubleClick(clickedFeatures, event);
            }
          });

        onClick &&
        map.on("singleclick", function (event: MapBrowserEvent<any>) {
          event.stopPropagation();
          if (map) {
            const clickedFeatures = map.getFeaturesAtPixel(event.pixel);
            onClick && onClick(clickedFeatures, event);
            if (enableFitWhenClick) {
              fitToFeatures(clickedFeatures);
            }
          }
        });

        onPointerDrag &&
        map.on("pointerdrag", function (event: ol.MapBrowserEvent<any>) {
          if (onPointerDrag) {
            onPointerDrag(event);
          }
        });

        onPointerMove &&
        map.on("pointermove", function (event: ol.MapBrowserEvent<any>) {
          const hoveredFeatures = map.getFeaturesAtPixel(event.pixel);
          if (onPointerMove) {
            onPointerMove(hoveredFeatures, event);
          }
        });

        onPointerOut &&
        map.on("pointerout", function (event: ol.MapBrowserEvent<any>) {
          if (onPointerOut) {
            onPointerOut(event);
          }
        });
      }
    }

    useImperativeHandle(
      ref,
      () => ({
        zoom: (zoom: number) => {
          if (viewRef.current instanceof View) {
            viewRef.current.setZoom(zoom);
          }
        },
        zoomSmooth: (zoom: number) => {
          if (viewRef.current instanceof View) {
            viewRef.current.animate({
              zoom,
              duration: 250,
            });
          }
        },
      }),
      []
    );

    return (
      <MapContext.Provider value={map}>
        <div ref={mapElement} className={"map " + className}>
          {children}
        </div>
      </MapContext.Provider>
    );
  }
);

export default OpenLayers;
export const useMap = () => React.useContext(MapContext);
