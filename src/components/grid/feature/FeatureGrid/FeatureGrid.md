<p>The following functionalities are present in the grid:</p>
<ul>
    <li>If the feature is selected in the grid, it will be highlighted in the map</li>
    <li>Multiple selection is possible by default holding the shift key and selecting the rows in the grid</li>
    <ul>
        <li>If you need a single selection, set the value "single" for the property <code>rowSelection</code></li>
    </ul>
    <li>If the feature property is changed, the result is reflected in the grid</li>
    <ul>
        <li>See the result after clicking in the "Change Name" button</li>
    </ul>
</ul>


```js
import {useState} from 'react';
import {Button} from 'antd';
import {createDefaultMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import FeatureGrid from './FeatureGrid';
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
const FeatureGridExample = () => {
    const [selectedFeatures, setSelectedFeatures] = useState([]);


    const onSelectionChanged = (evt) => {
        const features = [];
        evt.api.getSelectedRows().forEach((row) => {
            console.log('feature:', row.__feature.getProperties());
            features.push(row.__feature);
        });
        setSelectedFeatures(features);
    };

    const changeNameHandler = () => {
        selectedFeatures.forEach((feature) => {
            feature.set('NAME', feature.get('NAME') + 'X');
        });
    }

    return(
        <div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
            <Button type="primary" 
                    style={{width:'30%'}} 
                    disabled={selectedFeatures.length === 0}
                    onClick={changeNameHandler}
            >
                Change Name
            </Button>
            <MapWidget map={map} height='60%' width='100%'/>
            <div style={{height:'40%'}}>
                <FeatureGrid map={map} onSelectionChanged={onSelectionChanged} 
                            vectorLayer={vectorLayer} columnDefs={[
                    {headerName: 'ID', field: 'PROVINCE_ID'},
                    {headerName: 'Name', field: 'NAME'},
                    {headerName: 'Region', field: 'REGION'}
                ]}/>
            </div>
        </div>
    );
}
<FeatureGridExample/>
```