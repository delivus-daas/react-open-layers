import React, { forwardRef, useEffect, useRef, useState } from "react";
import * as ol from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { defaults as interactionDefaults } from "ol/interaction/defaults";
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
    }: OpenLayersProps,
    ref
  ) => {
    const [map, setMap] = useState<any>();
    const mapElement = useRef<any>();
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
      if (mapElement.current && !map) {
        const layers = layersProp || [new TileLayer({ source: new OSM() })];
        const center = initialCenter
          ? transform(initialCenter, "EPSG:4326", "EPSG:3857")
          : undefined;

        const map = new ol.Map({
          target: mapElement.current,
          layers,
          interactions: interactionDefaults(interactionOptions),
          view: new ol.View({ center, ...viewOptions }),
          moveTolerance: moveTolerance,
          maxTilesLoading: maxTilesLoading,
        });
          map.on('loadstart',function(event){
              if(onLoadStart){
                  onLoadStart(event)
              }

          })
          map.on('loadend',function(event){
              if(onLoadEnd){
                  onLoadEnd(event)
              }
          })
          map.on('dblclick', function (event) {
              if (onDoubleClick) {
                  const clickedFeatures = map.getFeaturesAtPixel(event.pixel);
                  onDoubleClick(clickedFeatures,event)
              }
          });

          map.on('pointerdrag',function(event){
              if(onPointerDrag){
                  onPointerDrag(event)
              }
          })

          map.on('movestart',function(event){
              if(onMoveStart){
                  onMoveStart(event)
              }
          })

          map.on('moveend',function(event){
              if(onMoveEnd){
                  onMoveEnd(event)
              }
          })

          map.on('postrender',function(event){
              if(onPostRender){
                  onPostRender(event)
              }
          })

          map.on('postcompose',function(event){
              if(onPostCompose){
                  onPostCompose(event)
              }
          })

          map.on('precompose',function(event){
              if(onPreCompose){
                  onPreCompose(event)
              }
          })

          map.on('rendercomplete',function(event){
              if(onRenderComplete){
                  onRenderComplete(event)
              }
          })

        onClickFeatures && addOnClickListener(map);
        onMouseOverFeatures && addOnMouseOverListener(map);
        setMap(map);
      }
    }, [mapElement]);

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

export default Map;
export const useMap = () => React.useContext(MapContext);
