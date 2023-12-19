import React, { useEffect, useRef } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { FeatureNames } from "../map.type";
import Polygon from 'ol/geom/Polygon.js';
import {PolygonProps} from "./polygon.type";
import { useMap } from "../OpenLayers";
import { Feature } from "ol";
import {Coordinate} from "../layers/layer.type";
import {fromLonLat} from "ol/proj";
import {Circle, Fill, Stroke, Style} from "ol/style";
import {MultiPoint} from "ol/geom";

const CustomPolygon = ({ coordinateGroups, options = { zIndex: 10 } }: PolygonProps) => {
  const map = useMap();
  const source = useRef<any>();
  const vectorLayer = useRef<any>();

  useEffect(() => {
    if (map && !source.current) {
      source.current = new VectorSource();
      vectorLayer.current = new VectorLayer({
        source: source.current,
        style: styleFunction,
        ...options,
      });
      vectorLayer.current.set("name", FeatureNames.polygon);
      vectorLayer.current.set("opacity", 3);
      map.addLayer(vectorLayer.current);
    }
    return () => {
      resetLayers();
    };
  }, [map]);

  const resetLayers = () => {
    if (map && map.getLayers().getArray().length > 0) {
      map.removeLayer(vectorLayer.current);
    }
  };

  useEffect(() => {
    console.log("drawPolygons 1", coordinateGroups)
    drawPolygons(coordinateGroups);
  }, [coordinateGroups, map]);

  const drawPolygons = (coordinateGroups?: Coordinate[][]) => {
    console.log("drawPolygons", coordinateGroups)
    let feature: any;
    if (coordinateGroups && coordinateGroups.length > 0) {
      const coordinates = coordinateGroups.map(
        (coordinateGroup, index) => {
          return coordinateGroup.map((coordinate, index) => fromLonLat([coordinate.longitude, coordinate.latitude]));
        }
      );
      feature = new Feature(new Polygon(coordinates));
      console.log("coordinate", coordinates);
    }
    if (source.current && feature) {
      source.current.clear();
      source.current.addFeatures([feature]);
    }
  };

  const styleFunction = () => {
    const style = [
      new Style({
        stroke: new Stroke({
          color: 'rgba(0,0,255,0.4)',
          width: 2,
        }),
        fill: new Fill({
          color: `rgba(0,0,255,0.2)`,
        }),
      }),
      new Style({
        image: new Circle({
          radius: 3,
          fill: new Fill({
            color: 'rgba(0,0,255,0.4)',
          }),
        })
      }),
    ];
    return style;
  };


  return null;
};

export default CustomPolygon;
