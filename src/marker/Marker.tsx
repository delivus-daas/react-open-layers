import React, {
  forwardRef,
  useEffect,
} from "react";
import { Cluster } from "ol/source";
import { fromLonLat } from "ol/proj";
import { MarkerProps } from "./marker.type";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { FeatureNames } from "../map.type";
import CircleStyle from "ol/style/Circle";
import {useMap} from "../OpenLayersMap";
import {Options} from "ol/style/Icon";
// @ts-ignore
import markerIcon from "../assets/marker.png";

declare global {
  interface Window {
    mouseOut: boolean;
  }
}

const Marker = forwardRef(
  (
    {
      coordinate,
      datum,
      index,
      iconOptions,
    }: MarkerProps<any>,
    ref
  ) => {
    const {map, clusterEnabled} = useMap();
    const defaultIconOptions:Options = {
      src: markerIcon
    };

    useEffect(() => {
      drawMarker();
    }, [coordinate, map]);

    function drawMarker() {
      console.log("drawMrker", map, coordinate)
      if(map) {
        const coord = fromLonLat([coordinate.longitude, coordinate.latitude]);
        const feature = new Feature({
          geometry: new Point(coord),
        });
        feature.setProperties({
          datum,
          id: index + 1,
        });

        let options:Options;
        if(iconOptions){
          options = {scale: 0.1,  ...iconOptions}
        }else{
          options = {scale: 0.1, ...defaultIconOptions}
        }
        const iconStyle = new Style({
          image: new Icon(options),
        });
        feature.setStyle(function (feature: any) {
          return [iconStyle];
        });

        const source = new VectorSource({
          features: [feature],
        });
        const vectorLayer = new VectorLayer({
          source,
        });
        vectorLayer.set("name", FeatureNames.marker);
        vectorLayer.set("opacity", 2);

        const layers = map.getLayers();
        const item = layers.item(1);
        console.log('drawmarker layer',item, layers);
        layers.insertAt(1, vectorLayer);

        if(clusterEnabled)
          drawCluster(source);
      }
    }

    function drawCluster(source: VectorSource) {
      if(map) {
        let clusterSource = new Cluster({
          distance: 10,
          minDistance: 10,
          source,
        });
        const clusterLayer = new VectorLayer({
          source: clusterSource,
          style: function (feature: any) {
            const size = feature.get("features").length;
            let style = styleCache[size];
            if (size === 1) {
              return null;
            } else {
              style = new Style({
                image: new CircleStyle({
                  radius: 12,
                  stroke: new Stroke({
                    color: "#fff",
                  }),
                  fill: new Fill({
                    color: "#3399CC",
                  }),
                }),
                text: new Text({
                  text: size.toString(),
                  fill: new Fill({
                    color: "#fff",
                  }),
                }),
              });
              styleCache[size] = style;
              return style;
            }
          },
        });

        const styleCache: any = {};

        clusterLayer.set("name", FeatureNames.cluster);
        clusterLayer.set("opacity", 2);
        map.addLayer(clusterLayer);
      }
    }
    return null;
  }
);

export default Marker;
