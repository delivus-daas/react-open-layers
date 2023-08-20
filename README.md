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


## License


[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)


## Authors

- [Chimeg](https://github.com/Chimaa123)
- [Manoj](https://github.com/manojjonam10)



