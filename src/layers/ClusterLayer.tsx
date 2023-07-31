import React, { useEffect, useRef } from "react";
import { Cluster } from "ol/source";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import { FeatureNames } from "../map.type";
import CircleStyle from "ol/style/Circle";
import { ClusterLayerProps } from "./layer.type";
import VectorSource from "ol/source/Vector";
import { useMap } from "../Map";
import { Feature } from "ol";
// @ts-ignore
import marker from "../assets/marker.png";
import { Options } from "ol/style/Icon";
import { FeatureLike } from "ol/Feature";
import { boundingExtent } from "ol/extent";
import { fromLonLat } from "ol/proj";
import { Point } from "ol/geom";
import { MarkerProps } from "../marker/marker.type";

const ClusterLayer = ({
  children,
  markers,
  fitOptions = { duration: 500, padding: [50, 50, 50, 50] },
  clusterOptions = {},
  clusterStyle,
  enableFitWhenClick,
  onClickMap,
  onClickFeatures,
  onMouseOutFeatures,
  onMouseOverFeatures,
}: ClusterLayerProps) => {
  const map = useMap();
  const source = useRef<any>();
  const clusterLayer = useRef<any>();
  const hoveredFeaturesRef = useRef<any[]>([]);
  const styleCache: any = {};

  const defaultIconOptions: Options = {
    src: marker,
    scale: 0.1,
  };

  function defaultClusterStyle(size: number, fill?: Array<number>) {
    return {
      image: new CircleStyle({
        radius: 12,
        stroke: new Stroke({
          color: "#fff",
        }),
        fill: new Fill({
          color: fill || "#3399CC",
        }),
      }),
      text: new Text({
        text: size.toString(),
        fill: new Fill({
          color: "#fff",
        }),
      }),
    };
  }

  useEffect(() => {
    if (map && !source.current) {
      resetLayers();
      // const features = drawFeatures(markers);
      source.current  = new VectorSource();

      let clusterSource = new Cluster({
        distance: 10,
        minDistance: 10,
        source: source.current,
      });

      clusterLayer.current = new VectorLayer({
        source: clusterSource,
        style: function (feature: any, resolution: number) {
          const features = feature.get("features");
          const size = features?.length;
          let style = styleCache[size];
          console.log('style', style);
          // if (style) {
          //   return style;
          // }
          if (size > 0) {
            style = features[0].getStyle();
            if (size > 1) {
              style = new Style(
                clusterStyle
                  ? clusterStyle(resolution, size, style[0]?.image_?.color_)
                  : defaultClusterStyle(size, style[0]?.image_?.color_)
              );
            }
            styleCache[size] = style;
            return style;
          }
          return null;
        },
        ...clusterOptions,
      });

      clusterLayer.current.set("name", FeatureNames.cluster);
      clusterLayer.current.set("opacity", 2);
      map.addLayer(clusterLayer.current);

      onClickFeatures && addOnClickListener(map);
      onMouseOverFeatures && addOnMouseOverListener(map);
    }
    return () => {
      resetLayers();
    };
  }, [map, markers]);

  const resetLayers = () => {
    if (map && map.getLayers().getArray().length > 0) {
      map.removeLayer(clusterLayer.current);
    }
  };

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
            const coordinate = features[0].getGeometry().getCoordinates();
            onClickFeatures && onClickFeatures(features, coordinate);
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
      if (map) {
        const hoveredFeatures = map.getFeaturesAtPixel(event.pixel);
        if (hoveredFeatures?.length) {
          console.log("hoveredFeature", hoveredFeaturesRef.current, hoveredFeatures, hoveredFeaturesRef.current != hoveredFeatures)
          if(hoveredFeaturesRef.current != hoveredFeatures)
          {
            hoveredFeaturesRef.current = hoveredFeatures;
            const features = hoveredFeatures[0].get("features");
            if (features?.length) {
              onMouseOverFeatures && onMouseOverFeatures(features, event);
              return;
            }
          }
        } else if (hoveredFeaturesRef.current) {
          hoveredFeaturesRef.current = [];
          onMouseOutFeatures && onMouseOutFeatures();
        }
      }
      event.preventDefault();
    });
  }

  const drawFeatures = (markers?: MarkerProps[]) => {
    console.log("drawFeatures");
    let features: any = [];
    if (markers && markers?.length > 0) {
      features = markers.map(
        ({ iconOptions, coordinate, properties }, index) => {
          const coord = fromLonLat([coordinate.longitude, coordinate.latitude]);
          const feature = new Feature({
            geometry: new Point(coord),
          });
          properties && feature.setProperties(properties);

          const iconStyle = new Style({
            image: new Icon(iconOptions || defaultIconOptions),
          });
          feature.setStyle([iconStyle]);
          return feature;
        }
      );
    }
    return features;
  };

  return <>{children(source.current)}</>;
};

export default ClusterLayer;
