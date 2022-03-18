<p> 
    This button MUST be used with the <i>Feature Grid</i> component. 
    So, once the user clicks on the button, all the selected features 
    in the grid will be removed from the vector layer.
</p>

```js
import React, {useState} from 'react';
import {createDefaultMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import FeatureGrid from '../../../grid/feature/FeatureGrid/FeatureGrid';
import ClearSelectedFeaturesButton from './ClearSelectedFeaturesButton';
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

const [gridApi, setGridApi] = useState(null);

//event handler to start the grid api
const onGridReady = (params) => {
    setGridApi(params.api);
};

const onSelectionChanged = (evt) => {
    evt.api.getSelectedRows().forEach((row) => {
        console.log('feature:', row.__feature.getProperties());
    });
};

//create map and vector layer
const map = createDefaultMap();
const vectorLayer = initVectorLayer(map);

<div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
    <MapWidget map={map} height='60%' width='100%'/>
    <ClearSelectedFeaturesButton type="primary" vectorLayer={vectorLayer} gridApi={gridApi}>
        Clear Selected Feature(s)
    </ClearSelectedFeaturesButton>
    <div style={{height:'40%'}}>
        <FeatureGrid map={map} onSelectionChanged={onSelectionChanged} 
                    vectorLayer={vectorLayer} onGridReady={onGridReady}
                    columnDefs={[
                        {headerName: 'ID', field: 'PROVINCE_ID'},
                        {headerName: 'Name', field: 'NAME'},
                        {headerName: 'Region', field: 'REGION'}
                    ]}
        />
    </div>
</div>
```