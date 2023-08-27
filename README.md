# React openlayers wrapper

A wrapper library designed to create openlayers map in an easy and customizablew way.

## Installation

Install with npm

```bash
  npm install @delivus/react-open-layers
```

Install with yarn

```bash
  yarn add @delivus/react-open-layers
```

Preferred node version: 16


# Documentation

## Full usage

```typescript

import {
  ClusterLayer,
  Control,
  OpenLayers,
  Overlay,
} from "@delivus/react-open-layers";


```

```xml

  <OpenLayers
   interactionOptions={{ pinchZoom: true }}
   className={"shipping-map"}
   onMouseOverFeatures={handleMouseOverCluster}
   onMouseOutFeatures={handleMouseOutCluster}
   onClickFeatures={handleClickCluster}>
   
   <Control
    id={"right-control"}
    className={"map-floating-cntr map-right-floating shipping-float"}>
      {children}
    </Control>
    <Overlay
     id={"shipping-tooltip"}
     className={"tooltip"}
     position={hoveredShippingTooltip?.position}>
    <ShippingsTooltip shippings={hoveredShippingTooltip?.shippings} />
    </Overlay>
    <ClusterLayer
      clusterStyle={styleShippingCluster}
      features={renderMarkers()}
      />
    </OpenLayers>
```
## Examples
[Basic example](https://codesandbox.io/s/react-open-layers-basic-example-5sw8m6)

## Available Loaders, PropTypes, and Default Values

Optional default props for all Map components:

```
  interactionOptions: DefaultsOptions;
  layers: BaseLayer[] | Collection<BaseLayer> | LayerGroup | undefined;
  showZoom: boolean;
  zoomInStyle: zoomStyleProps;
  zoomOutStyle: zoomStyleProps;
  viewOptions: ViewOptions;
  initialCenter: number[];
  className: string;
  children: ReactNode | ReactNode[];
  fitOptions: FitOptions;
  enableFitWhenClick: boolean;
  onClickMap: () => void;
  onClick:(feature: FeatureLike[], event:  ol.MapBrowserEvent<any>) => void;
  onLoadStart: (event:  ol.MapEvent)=>void;
  onLoadEnd: (event:  ol.MapEvent)=>void;
  onMoveStart: (event:  ol.MapEvent)=>void;
  onMoveEnd: (event:  ol.MapEvent)=>void;
  onPointerDrag: (event:  ol.MapBrowserEvent<any>)=>void;
  onPointerMove: (event:  ol.MapBrowserEvent<any>)=>void;
  onPostRender: (event:   ol.MapEvent)=>void;
  onPostCompose: (event:  any)=>void;
  onPreCompose: (event:  any)=>void;
  onRenderComplete: (event:  any)=>void;
  onDoubleClick:(feature: FeatureLike[], event:  ol.MapBrowserEvent<any>) => void;
  onMouseOverFeatures: (feature: Feature<Geometry>[], event: Event) => void;
  onMouseOutFeatures: (feature?: Feature<Geometry>[]) => void;
  onClickFeatures: (feature: Feature<Geometry>[], event: Event) => void;
  moveTolerance: number;
  maxTilesLoading: number;
```


### `interactionOptions`

`interactionOptions` prop is a set of interactions included in maps by default

for more information : [interactionOptions](https://openlayers.org/en/latest/apidoc/module-ol_interaction_defaults)

### `layers`

The `layers` prop allows user to add layers for the map as an array collection similar to openlayers prop for layers.

For example :
`layers: [
raster,
vector
],`

### `showZoom`

The `showZoom` props is a boolean value and enable / disable zoom icons on the openlayers map

### `zoomInStyle` & `zoomOutStyle`

Both `zoomInStyle` & `zoomOutStyle` props allows styling for zoomIn and zoomOut buttons that are displayed on the map view

Accepted styling props are:

 ```
  width: string;
  height: string;
  backgroundColor: string;
  bottom: string;
  top: string;
  left: string;
  right: string;
```

### `viewOptions`

`viewOptions` prop is a set of view properties included in maps by default

for more information : [viewOptions](https://openlayers.org/en/latest/apidoc/module-ol_View-View.html)

### `initialCenter`

The `initialCenter` prop allows user to set center point on map

The default center point for map is set as `[126.83, 37.57] (South Korea)`

### `className`

`className` prop allows styling of map component

### `children`

`children` prop allows to mount react node component as child

### `fitOptions`

`fitOptions` prop allows to set view component of ol map view  [fitOptions](https://openlayers.org/en/latest/apidoc/module-ol_View.html#~FitOptions)

### `enableFitWhenClick`

`enableFitWhenClick` prop enables singleClick function on features populated on the map

### `onClickMap`

`onClickMap` prop returns a listener event object whenever map is clicked


### `onClick`

`onClick` prop returns a single click event listener ol browser map event object whenever features in the map are clicked and feature data

### `onLoadStart`

`onLoadStart` event is triggered when loading of additional map data (tiles, images, features) starts.


### `onLoadEnd`

`onLoadEnd` event is triggered when loading of additional map data has completed.


### `onMoveStart`

`onMoveStart` event is triggered when the map starts moving.

### `onMoveEnd`

`onMoveEnd` event is triggered after the map is moved.

### `onPointerDrag`

`onPointerDrag` event is triggered when a pointer is dragged.


### `onPointerMove`

`onPointerMove` event is triggered when a pointer is moved. Note that on touch devices this is triggered when the map is panned, so is not the same as mousemove.

### `onPostRender`

`onPostRender` event is triggered after a map frame is rendered.

### `onPostCompose`

`onPostCompose` event is triggered after layers are composed. When dispatched by the map, the event object will not have a context set. When dispatched by a layer, the event object will have a context set. Only WebGL layers currently dispatch this event.

### `onPreCompose`

`onPreCompose` event is  triggered before layers are composed. When dispatched by the map, the event object will not have a context set. When dispatched by a layer, the event object will have a context set. Only WebGL layers currently dispatch this event.

### `onRenderComplete`

`onRenderComplete` event is triggered when rendering is complete, i.e. all sources and tiles have finished loading for the current viewport, and all tiles are faded in. The event object will not have a context set.

### `onDoubleClick`

`onDoubleClick` event is a true double click, with no dragging.


### `onMouseOverFeatures`

`onPointerDrag` event is triggered when a pointer is dragged.


### `onMouseOutFeatures`

`onPointerDrag` event is triggered when a pointer is dragged.


### `onClickFeatures`

`onClickFeatures` event is triggered when a pointer is dragged.

### `moveTolerance`

`onClickFeatures` event is triggered when a pointer is dragged.

### `maxTilesLoading`

`onClickFeatures` event is triggered when a pointer is dragged.


## License


[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)


## Authors

- [Chimeg](https://github.com/Chimaa123)
- [Manoj](https://github.com/manojjonam10)
