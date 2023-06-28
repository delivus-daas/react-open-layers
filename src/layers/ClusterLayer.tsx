import React, { useEffect, useRef } from "react";
import { Cluster } from "ol/source";
import {Fill, Stroke, Style, Text} from "ol/style";
import VectorLayer from "ol/layer/Vector";
import { FeatureNames } from "../map.type";
import CircleStyle from "ol/style/Circle";
import {ClusterLayerProps, LayerProps} from "./layer.type";
import VectorSource from "ol/source/Vector";
import { useMap } from "../Map";
import {boundingExtent} from "ol/extent";
import {FeatureLike} from "ol/Feature";

declare global {
  interface Window {
    mouseOut: boolean;
  }
}

const ClusterLayer = ({ children, clusterOptions, enableFit, fitOptions, onClick, onMouseOver, onMouseOut }: ClusterLayerProps) => {
  const map = useMap();
  const source = useRef<VectorSource>();
  const defaultFitOptions = {
    duration: 500,
    padding: [50, 50, 50, 50],
  }
  function defaultStyle(size: number, fill?: Array<number>) {
    return {
      image: new CircleStyle({
        radius: 12,
        stroke: new Stroke({
          color: "#fff",
        }),
        fill: new Fill({
          color: fill || '#3399CC',
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
      source.current = new VectorSource();
      let clusterSource = new Cluster({
        distance: 10,
        minDistance: 10,
        source: source.current,
      });

      const clusterLayer = new VectorLayer({
        source: clusterSource,
        style: function (feature: any) {
          const features = feature.get("features");
          const size = features.length;
          let style = null;
          if(size>0) {
            style = features[0].getStyle();
            console.log("feature", size, style[0]?.image_)
            if (size > 1) {
              style = new Style(clusterOptions || defaultStyle(size, style[0]?.image_?.color_));;
            }
            return style;
          }
          return null;
        },
      });

      clusterLayer.set("name", FeatureNames.cluster);
      clusterLayer.set("opacity", 2);
      map.addLayer(clusterLayer);
      addOnClickListener(clusterLayer)
      addOnMouseOverListener(clusterLayer)
    }
  }, [map]);

  function addOnClickListener (clusterLayer: VectorLayer<VectorSource>) {
    map.on("click", async (event: any) => {
      await clusterLayer
          .getFeatures(event.pixel)
          .then((clickedFeatures: any) => {
            if (clickedFeatures.length) {
              const features = clickedFeatures[0].get("features");
              if (features.length > 0) {
                if (onClick)
                  onClick(features, event);

                if(enableFit)
                  fitToCluster(features);
              }
            }
          });
    });
  }

  function addOnMouseOverListener (clusterLayer: VectorLayer<VectorSource>) {
    map.on('pointermove', async (event: any) => {
      event.stopPropagation();
      await clusterLayer.getFeatures(event.pixel).then((clickedFeatures:any) => {
        if (clickedFeatures.length) {
          const features = clickedFeatures[0].get('features');
          if (onMouseOver)
            onMouseOver(features, event);
        }else{
          if (onMouseOut)
            onMouseOut();
        }
      });
    })
  }

  function fitToCluster(features: FeatureLike[]) {
    const extent = boundingExtent(
        features.map((r: any) =>
            r.getGeometry().getCoordinates()
        )
    );
    map.getView().fit(extent, fitOptions || defaultFitOptions);
  }

  return <>{children(source.current)}</>;
};

export default ClusterLayer;
