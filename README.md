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
  onMapBoundChanged: (bounds: any) => void;
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


### `interactionOptions` prop

`interactionOptions` prop is a set of interactions included in maps by default

for more information : [interactionOptions](https://openlayers.org/en/latest/apidoc/module-ol_interaction_defaults)

### `cssOverride` prop

The `cssOverride` prop is an object of camelCase styles used to create inline styles on the loaders. Any html css property is valid here.

### `size`, `height`, `width`, and `radius` props

The input to these props can be _number_ or _string_.

- If value is number, the loader will default to css unit `px`.
- If value is string, the loader will verify the unit against valid css units.
 - If unit is valid, return the original value
 - If unit is invalid, output warning console log and default to `px`.

The table below has the default values for each loader.



## License


[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)


## Authors

- [Chimeg](https://github.com/Chimaa123)
- [Manoj](https://github.com/manojjonam10)
