<p>
    In the example below, altough I have added the <i>Feature Grid</i> component, 
    it is not required for the usage of the <i>WFS Search By BBOX</i> button.
</p>
<p>To illustrate a search on the features by Boundary Box, follow the steps:</p>
<ol>
    <li>
        Click the button <i>Search by BBox</i>. 
    </li>
    <li>
        Hold down the "ctrl" key, click  the first corner and drag to the second corner.
        The boundary box will be defined by these two corners.
        As a result, the WFS request will be fired and the features intersecting this
        boundary box will be retrieved.
    </li>
</ol>

```js
import React, {useState} from 'react';
import {createDefaultMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import FeatureGrid from '../../../grid/feature/FeatureGrid/FeatureGrid';
import WfsSearchByBBoxButton from './WfsSearchByBBoxButton';
import OlSourceVector from 'ol/source/Vector';
import OlLayerVector from 'ol/layer/Vector';

//function to create a empty vector layer 
const createVectorLayer = (map) => {
  const layer = new OlLayerVector({
    name: 'WFS GRB Address Layer',
    source: new OlSourceVector()
  });
  map.addLayer(layer);
  return layer;
};

//returns a valid wfs options
const getWfsOptions = () => {
    const wfsOptions = {
        srsName: 'EPSG:4326',
        featureNS: 'informatievlaanderen.be/Adressen',
        featurePrefix: 'Adressen',
        featureTypes: ['Adrespos'],
        geometryName: 'adrespositie',
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
const url = 'https://geoservices.informatievlaanderen.be/overdrachtdiensten/Adressen/wfs';
const wfsOptions = getWfsOptions();

<div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
    <MapWidget map={map} height='60%' width='100%'/>
    <WfsSearchByBBoxButton 
        type="primary" 
        url={url}
        map={map} 
        vectorLayer={wfsLayer}
        wfsOptions={wfsOptions}
    >
        Search by BBOX
    </WfsSearchByBBoxButton>
    <div style={{height:'40%'}}>
        <FeatureGrid map={map} 
                     vectorLayer={wfsLayer}
                     columnDefs={[
                        {headerName: 'Street Name', field: 'straatnaam'},
                        {headerName: 'Postal Code', field: 'postkantoncode'},
                        {headerName: 'District', field: 'gemeentenaam'},
                        {headerName: 'House Number', field: 'huisnummer'},
                        {headerName: 'BUS Number', field: 'busnummer'},
                        {headerName: 'Apartment Number', field: 'appartementnummer'}
                    ]}
        />
    </div>
</div>
```