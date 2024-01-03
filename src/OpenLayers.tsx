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
      onClickMap,
      onClickFeatures,
      onDoubleClick,
      onMouseOutFeatures,
      onMouseOverFeatures,
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
    }: OpenLayersProps,
    ref
  ) => {
    const [map, setMap] = useState<any>();
    const mapElement = useRef<any>();
    const mapRef = useRef<any>();
    const hoveredFeaturesRef = useRef<any[]>([]);

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

        mapRef.current.on("loadstart", function (
          event: ol.MapBrowserEvent<any>
        ) {
          if (onLoadStart) {
            onLoadStart(event);
          }
        });
        mapRef.current.on("loadend", function (event: ol.MapBrowserEvent<any>) {
          if (onLoadEnd) {
            onLoadEnd(event);
          }
        });
        mapRef.current.on("dblclick", function (
          event: ol.MapBrowserEvent<any>
        ) {
          if (onDoubleClick) {
            const clickedFeatures = map.getFeaturesAtPixel(event.pixel);
            onDoubleClick(clickedFeatures, event);
          }
        });

        mapRef.current.on("dblclick", function (
          event: ol.MapBrowserEvent<any>
        ) {
          if (onDoubleClick) {
            const clickedFeatures = map.getFeaturesAtPixel(event.pixel);
            onDoubleClick(clickedFeatures, event);
          }
        });

        mapRef.current.on("pointerdrag", function (
          event: ol.MapBrowserEvent<any>
        ) {
          if (onPointerDrag) {
            onPointerDrag(event);
          }
        });

        mapRef.current.on("movestart", function (
          event: ol.MapBrowserEvent<any>
        ) {
          if (onMoveStart) {
            onMoveStart(event);
          }
        });

        mapRef.current.on("moveend", function (event: ol.MapBrowserEvent<any>) {
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

        mapRef.current.on("postrender", function (
          event: ol.MapBrowserEvent<any>
        ) {
          if (onPostRender) {
            onPostRender(event);
          }
        });

        mapRef.current.on("postcompose", function (
          event: ol.MapBrowserEvent<any>
        ) {
          if (onPostCompose) {
            onPostCompose(event);
          }
        });

        mapRef.current.on("precompose", function (
          event: ol.MapBrowserEvent<any>
        ) {
          if (onPreCompose) {
            onPreCompose(event);
          }
        });

        mapRef.current.on("rendercomplete", function (
          event: ol.MapBrowserEvent<any>
        ) {
          if (onRenderComplete) {
            onRenderComplete(event);
          }
        });

        if (onClickFeatures) addOnClickListener(mapRef.current);
        else {
          mapRef.current.on("singleclick", function (
            event: ol.MapBrowserEvent<any>
          ) {
            if (onClick) {
              const clickedFeatures = map.getFeaturesAtPixel(event.pixel);
              onClick(clickedFeatures, event);
            }
          });
        }

        if (onMouseOverFeatures) addOnMouseOverListener(mapRef.current);
        else {
          mapRef.current.on("pointermove", function (
            event: ol.MapBrowserEvent<any>
          ) {
            if (onPointerMove) {
              onPointerMove(event);
            }
          });
        }

        setMap(mapRef.current);
      }
    }, []);

    function fitToCluster(features: FeatureLike[]) {
      const extent = boundingExtent(
        features.map((r: any) => r.getGeometry().getCoordinates())
      );
      map.getView().fit(extent, fitOptions);
    }

    function addOnClickListener(map: any) {
      map.on("singleclick", function (event: any) {
        event.stopPropagation();
        if (map) {
          const clickedFeatures = map.getFeaturesAtPixel(event.pixel);
          if (clickedFeatures?.length) {
            const features = clickedFeatures[0].get("features");
            if (features?.length > 0) {
              //if features are clusters
              onClickFeatures && onClickFeatures(features, event);
              if (enableFitWhenClick) fitToCluster(features);
            } else {
              onClickFeatures && onClickFeatures(clickedFeatures, event);
              if (enableFitWhenClick) fitToCluster(clickedFeatures);
            }
          } else {
            !!onClickMap && onClickMap();
          }
        }
      });
    }

    function addOnMouseOverListener(map: any) {
      map.on("pointermove", (event: any) => {
        if (map) {
          const hoveredFeatures = map.getFeaturesAtPixel(event.pixel);
          if (hoveredFeatures?.length) {
            const features = hoveredFeatures[0].get("features");
            if (features?.length) {
              //if features are clusters
              hoveredFeaturesRef.current = features;
              onMouseOverFeatures && onMouseOverFeatures(features, event);
              return;
            } else {
              hoveredFeaturesRef.current = hoveredFeatures;
              onMouseOverFeatures &&
                onMouseOverFeatures(hoveredFeatures, event);
            }
          } else if (hoveredFeaturesRef.current?.length > 0) {
            onMouseOutFeatures &&
              onMouseOutFeatures(hoveredFeaturesRef.current);
            hoveredFeaturesRef.current = [];
          }
        }
        event.preventDefault();
      });
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
