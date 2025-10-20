import React, { useEffect, useRef } from 'react';
import { Cluster, OSM } from "ol/source";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import CircleStyle from "ol/style/Circle";
import { ClusterLayerProps } from "./cluster.type";
import VectorSource from "ol/source/Vector";
import { useMap } from "../OpenLayers";
import { Feature, Map, View } from "ol";
// @ts-ignore
import marker from "../assets/marker.png";
import { Options } from "ol/style/Icon";
import { fromLonLat } from "ol/proj";
import { Point } from "ol/geom";
import { PointProps } from "../point/point.type";
import { Select } from "ol/interaction";
import { click, pointerMove } from "ol/events/condition";
import { SelectEvent } from "ol/interaction/Select";
import { FeatureLike } from "ol/Feature";
import TileLayer from "ol/layer/Tile";

export const ClusterLayer = ({
                               points,
                               clusterOptions = {},
                               options = { zIndex: 10 },
                               onClick,
                               className,
                               onOver,
                               onSourceCreated,
                               clusterStyle,
                             }: ClusterLayerProps) => {
  // const map = useMap();
  const source = useRef<any>();
  const clusterLayer = useRef<any>();
  const overInteraction = useRef<any>();
  const clickInteraction = useRef<any>();
  const styleCache: any = {};

  const defaultIconOptions: Options = {
    src: marker,
    scale: 0.1,
  };

  function defaultClusterStyle(size: number) {
    let style = styleCache[size];
    if (!style) {
      style = new Style({
        image: new CircleStyle({
          radius: 10,
          stroke: new Stroke({
            color: '#fff',
          }),
          fill: new Fill({
            color: '#3399CC',
          }),
        }),
        text: new Text({
          text: size.toString(),
          fill: new Fill({
            color: '#fff',
          }),
        }),
      });
      styleCache[size] = style;
    }
    return style;
  }

  // const addInteraction = () => {
  //   if (map) {
  //     if (onOver) {
  //       const select = new Select({
  //         condition: pointerMove,
  //         layers: [clusterLayer.current],
  //       });
  //       select.on("select", (event) => {
  //         console.log("onOver", event.selected);
  //         onOver && onOver(event.selected, event.deselected, event);
  //       });
  //       overInteraction.current = select;
  //       map.addInteraction(select);
  //     } else if (overInteraction.current) {
  //       map.removeInteraction(overInteraction.current);
  //     }
  //     if (onClick) {
  //       const select = new Select({
  //         condition: click,
  //         layers: [clusterLayer.current],
  //       });
  //       select.on("select", (event: SelectEvent) => {
  //         console.log("onClick", event.selected);
  //         onClick && onClick(event.selected, event.deselected, event);
  //       });
  //       clickInteraction.current = select;
  //       map.addInteraction(select);
  //     } else if (clickInteraction.current) {
  //       map.removeInteraction(clickInteraction.current);
  //     }
  //   }
  // };
  // const removeInteraction = () => {
  //   if (map) {
  //     if (clickInteraction.current) {
  //       map.removeInteraction(clickInteraction.current);
  //     }
  //     if (overInteraction.current) {
  //       map.removeInteraction(overInteraction.current);
  //     }
  //   }
  // };
  //
  // const resetLayers = () => {
  //   if (map && map.getLayers().getArray().length > 0) {
  //     map.removeLayer(clusterLayer.current);
  //   }
  // };

  useEffect(() => {
    if (points) {
      const features = points
        .map((listing) => new Feature({
          geometry: new Point(fromLonLat(listing.coordinate)),
        }));
      console.log("ol features", features)
      const source = new VectorSource({
        features: features,
      });

      const clusterSource = new Cluster({
        distance: 10,
        minDistance: 10,
        source: source,
      });

      const clusterStyle = (feature: FeatureLike, resolution: number) => {
        const features: Feature[] = feature.get("features");
        const size = features.length;
        // Check cache
        console.log("clusterStyle2 features", features.length);
        if (!styleCache[size]) {
          styleCache[size] = new Style({
            image: new CircleStyle({
              radius: 10 + size,
              fill: new Fill({ color: '#E84C4F' }),
              stroke: new Stroke({ color: '#fff', width: 2 }),
            }),
            text: new Text({
              text: size > 1 ? size.toString() : '1',
              fill: new Fill({ color: '#fff' }),
              stroke: new Stroke({ color: '#000', width: 2 }),
            }),
          });
        }

        return styleCache[size];
      };

      const clusters = new VectorLayer({
        source: clusterSource,
        style: clusterStyle
      })
      const raster = new TileLayer({
        source: new OSM(),
      });
      const map = new Map({
        layers: [raster],
        target: 'map',
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });
      map.addLayer(clusters);
    }
  }, [points])

  // useEffect(() => {
  //   drawFeatures(points);
  // }, [points]);

  const drawFeatures = (markers?: PointProps[]) => {
    let features: any = [];
    if (markers && markers?.length > 0) {
      features = markers.map(
        ({ iconOptions, coordinate, properties }, index) => {
          const coord = fromLonLat(coordinate);
          const feature = new Feature({
            geometry: new Point(coord),
            properties,
          });
          if (!!iconOptions) {
            const iconStyle = new Style({
              image: new Icon(iconOptions),
            });
            feature.setStyle([iconStyle]);
          }
          return feature;
        }
      );
    }
    return features;
    // if (source.current) {
    //   source.current.clear();
    //   source.current.addFeatures(features);
    // }
  };

  console.log("render cluster layer")
  return (<div id="map" className={className}/>);
};
