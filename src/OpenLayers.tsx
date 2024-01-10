import React, { forwardRef, useEffect, useRef, useState } from "react";
import * as ol from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { defaults as interactionDefaults } from "ol/interaction/defaults";
import "./index.css";
import { transform, transformExtent } from "ol/proj";
import { OpenLayersProps } from "./map.type";
import { FeatureLike } from "ol/Feature";
import { boundingExtent } from "ol/extent";
import { MapBrowserEvent } from "ol";

const MapContext = React.createContext<any>(undefined);
const OpenLayers = forwardRef(
  (
    {
      initialCenter = [126.83, 37.57],
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
      onDoubleClick,
      showZoom,
      zoomInStyle,
      zoomOutStyle,
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
    }: OpenLayersProps,
    ref
  ) => {
    const [map, setMap] = useState<any>();
    const mapElement = useRef<any>();
    const mapRef = useRef<any>();

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
        const center = initialCenter
          ? transform(initialCenter, "EPSG:4326", "EPSG:3857")
          : undefined;

        mapRef.current = new ol.Map({
          target: mapElement.current,
          layers,
          interactions: interactionDefaults(interactionOptions),
          view: new ol.View({ center, ...viewOptions }),
          moveTolerance: moveTolerance,
          maxTilesLoading: maxTilesLoading,
        });

        addListeners(mapRef.current);
        setMap(mapRef.current);
      }
    }, []);

    function fitToFeatures(features: FeatureLike[]) {
      const extent = boundingExtent(
        features.map((r: any) => r.getGeometry().getCoordinates())
      );
      map.getView().fit(extent, fitOptions);
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
              let transExtent;
              if (mapRef.current) {
                const extent = mapRef.current
                  .getView()
                  .calculateExtent(mapRef.current.getSize());
                transExtent = transformExtent(
                  extent,
                  mapRef.current.getView().getProjection(),
                  "EPSG:4326"
                );
              }
              onMoveEnd(event, transExtent);
            }
          });

        onDoubleClick &&
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
