<p>
    In the example below, altough I have added the <i>Feature Grid</i> component, 
    it is not required for the usage of the <i>WFS Search By Point</i> button.
</p>
<p>To illustrate a search on the Parcel features by Point, follow the steps:</p>
<ol>
    <li>
        Click the button <i>Search by Point</i>. 
    </li>
    <li>
        Click a point in the map to select a Parcel.
        As a result, the WFS request will be fired and the Parcel intersecting this
        point will be retrieved.
    </li>
</ol>

```js
import React, {useState} from 'react';
import {createDefaultMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import FeatureGrid from '../../../grid/feature/FeatureGrid/FeatureGrid';
import WfsSearchByPointButton from './WfsSearchByPointButton';
import OlSourceVector from 'ol/source/Vector';
import OlLayerVector from 'ol/layer/Vector';

//function to create a empty vector layer 
const createVectorLayer = (map) => {
  const layer = new OlLayerVector({
    name: 'WFS GRB Cadastral Parcel Layer',
    source: new OlSourceVector()
  });
  map.addLayer(layer);
  return layer;
};

//returns a valid wfs options
const getWfsOptions = () => {
    const wfsOptions = {
        srsName: 'EPSG:4326',
        featureNS: 'informatievlaanderen.be/Adpf',
        featurePrefix: 'Adpf',
        featureTypes: ['Adpf'],
        geometryName: 'SHAPE',
        outputFormat: 'application/json',
        maxFeatures: 200
    };
    return wfsOptions;
};

//initialize variables
const viewOpts= {
    projection: 'EPSG:4326',
    center: [4.47182278, 50.85845229],
    zoom: 18
};
const map = createDefaultMap(viewOpts);
const wfsLayer = createVectorLayer(map);
const url = 'https://geoservices.informatievlaanderen.be/overdrachtdiensten/Adpf/wfs';
const wfsOptions = getWfsOptions();

<div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
    <MapWidget map={map} height='60%' width='100%'/>
    <WfsSearchByPointButton 
        type="primary" 
        url={url}
        map={map} 
        vectorLayer={wfsLayer}
        wfsOptions={wfsOptions}
    >
        Search by Point
    </WfsSearchByPointButton>
    <div style={{height:'40%'}}>
        <FeatureGrid map={map} 
                     vectorLayer={wfsLayer}
                     columnDefs={[
                        {headerName: 'OIDN', field: 'OIDN'},
                        {headerName: 'UIDN', field: 'UIDN'},
                        {headerName: 'Version', field: 'VERSDATUM'},
                        {headerName: 'CAPAKEY', field: 'CAPAKEY'},
                        {headerName: 'NIS Code', field: 'NISCODE'},
                        {headerName: 'Fiscal Date', field: 'FISCDATUM'},
                        {headerName: 'BHRDR', field: 'BHRDR'},
                        {headerName: 'LBLBHRDR', field: 'LBLBHRDR'}
                    ]}
        />
    </div>
</div>
```