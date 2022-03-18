<p>This example is showing the usage of the <i>Clear All Features</i> button.</p>
<p>
    Although we don't need to use the <i>Feature Grid</i> with this component, 
    our example is adding the <i>Feature Grid</i> to show that this grid will
    be synchronized once all the features are cleared from the vector layer.
</p>


```js
import React, {useState} from 'react';
import {createDefaultMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import FeatureGrid from '../../../grid/feature/FeatureGrid/FeatureGrid';
import ClearAllFeaturesButton from './ClearAllFeaturesButton';
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


//create map and vector layer
const map = createDefaultMap();
const vectorLayer = initVectorLayer(map);

<div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
    <MapWidget map={map} height='60%' width='100%'/>
    <ClearAllFeaturesButton type="primary" vectorLayer={vectorLayer}>
        Clear All Features
    </ClearAllFeaturesButton>
    <div style={{height:'40%'}}>
        <FeatureGrid map={map}  vectorLayer={vectorLayer}
                    columnDefs={[
                        {headerName: 'ID', field: 'PROVINCE_ID'},
                        {headerName: 'Name', field: 'NAME'},
                        {headerName: 'Region', field: 'REGION'}
                    ]}
        />
    </div>
</div>
```