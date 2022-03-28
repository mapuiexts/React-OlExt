<p>On the example below you can check how the WFS Grid Component works:</p>
<ul>
    <li> 
        The Grid is filled automatically with all the attributes for the WFS 
        defined in the variable <i>wfsOptions</i> in the code below.
    </li> 
    <li>
        The default search type is <i>By Property</i> and the different search types 
        can be visualized if you click the <i>Search Type</i> button.
    </li>
    <li>To illustrate a search on the features by property, follow the steps:</li>
    <ol>
        <li>
            Click in the button <i>Search Type</i> and select the option 
            <i>By Property</i> (it is the default option).
        </li>
        <li>
            In the <i>property</i> combobox select one of the properties. For instance,
            "straatnaam" (street name in dutch).
        </li>
        <li>
            In the <i>operator</i> combobox keep the option "Like".
        </li>
        <li>
            In the <i>property value</i> combobox enter the value "Essel*".
        </li>
        <li>
            Click the button <i>Search</i>. As a result, a WFS request will
            be fired and retrieve all the streets starting with the
            substring "Essel".
        </li>
        <li>
            Click in the <i>Zoom All</i> button to zoom to all the
            retrieved features.
        </li>
    </ol>
    <li>To illustrate a search on the features by Boundary Box, follow the steps:</li>
    <ol>
        <li>
            Click in the button <i>Search Type</i> and select the option 
            <i>By BBOX</i> 
        </li>
        <li>
            Click the button <i>Search by BBox</i>. 
        </li>
        <li>
            Press "ctrl", click  the first corner and drag to the second corner.
            The boundary box will be defined by these two corners.
            As a result, the WFS request will be fired and the features intersecting this
            boundary box will be retrieved and loaded in the grid.
        </li>
        <li>
            Click in the <i>Zoom->Zoom All</i> button to zoom to all the
            retrieved features.
        </li>
    </ol>
    <li>To illustrate a search on the features by Polygon, follow the steps:</li>
    <ol>
        <li>
            Click in the button <i>Search Type</i> and select the option 
            <i>By Polygon</i> 
        </li>
        <li>
            Click the button <i>Search by Polygon</i>. 
        </li>
        <li>
            Click 3 or more points to define the vertices of the polygon.
            To finish click the first vertice to close the polygon.
            As a result, the WFS request will be fired and the features intersecting this
            polygon will be retrieved and loaded in the grid.
        </li>
        <li>
            Click in the <i>Zoom All</i> button to zoom to all the
            retrieved features.
        </li>
    </ol>
</ul>


```js
import {createDefaultMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import WfsFeatureGrid from './WfsFeatureGrid';
import OlSourceVector from 'ol/source/Vector';
import OlLayerVector from 'ol/layer/Vector';



const onSelectionChanged = (evt) => {
    evt.api.getSelectedRows().forEach((row) => {
        console.log('feature:', row.__feature.getProperties());
    });
};


const addVectorLayer = (map) => {
  const layer = new OlLayerVector({
    name: 'WFS Flemish Addresses',
    source: new OlSourceVector()
  });
  map.addLayer(layer);
  return layer;
};

const getWfsOptions = () => {
    const wfsOptions = {
        srsName: 'EPSG:31370',
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
const url = 'https://geoservices.informatievlaanderen.be/overdrachtdiensten/Adressen/wfs';
const viewOpts= {
    projection: 'EPSG:31370',
    center: [157257, 172012],
    zoom: 18
};
const map = createDefaultMap(viewOpts);
const wfsLayer = addVectorLayer(map);
const wfsOptions = getWfsOptions();


<div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
    <MapWidget map={map} height='60%' width='100%'/>
    <div style={{height:'40%'}}>
         <WfsFeatureGrid 
            url={url} 
            wfsOptions={wfsOptions} 
            map={map} 
            vectorLayer={wfsLayer}
            onSelectionChanged = {onSelectionChanged}
         />
    </div>
</div>
```