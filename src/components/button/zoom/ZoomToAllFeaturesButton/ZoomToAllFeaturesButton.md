<p>This example is showing the usage of the <i>Zoom to All Features</i> button.</p>
<p>
    Just click in the <i>Zoom to All Features</i> button and the map will be zoomed 
    for the minimum extents on which all the features in the vector layer will be 
    visible in the map (the vector layer are the belgium provinces represented by
    blue polygons)
</p>


```js
import React, {useState} from 'react';
import {createDefaultMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import ZoomToAllFeaturesButton from './ZoomToAllFeaturesButton';
import belgiumProvinces from '../../../../assets/json/belgium-provinces.json';
import OlSourceVector from 'ol/source/Vector';
import OlLayerVector from 'ol/layer/Vector';
import OlFormatGeoJSON from 'ol/format/GeoJSON';

//function to create a vector layer using the json file
const initVectorLayer = (map) => {
    const format = new OlFormatGeoJSON();
    const features = format.readFeatures(belgiumProvinces);
    const layer = new OlLayerVector({
      name: 'Belgium Provinces',
      source: new OlSourceVector({
        features: features
      }),
    });
    map.addLayer(layer);
    return layer;
};

const viewOpts= {
    projection: 'EPSG:31370',
    center: [157257, 172012],
    zoom: 18
};

//create map and vector layer
const map = createDefaultMap(viewOpts);
const vectorLayer = initVectorLayer(map);

<div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
    <MapWidget map={map} height='90%' width='100%'/>
    <ZoomToAllFeaturesButton type="primary" map={map} vectorLayer={vectorLayer}>
        Zoom to All Features
    </ZoomToAllFeaturesButton>
</div>
```