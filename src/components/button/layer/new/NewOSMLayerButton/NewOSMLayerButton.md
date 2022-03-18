<p>This Example shows how to use the <i>New OSM Layer Button</i>.</p>
<p>
    Use the <i>Layer TreeSelect</i> component to select the Layer Group
    on where the new OSM Layer will be added.
</p>
<p>Some steps to see how it works:</p>
<ul>
    <li>Select the Layer Group "Layers" ou "Group 1" in the TreeSelect</li>
    <li>Click in the button "New OSM Layer</li>
    <li>
        In the new window, set the name of the OSM Layer and click the 
        <i>submit</i> button to create the new OSM layer.
    </li>
    <li>
        The TreeSelect will now have the newly created 
        OSM layer".
    </li>
</ul>

```js
import {useState} from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import LayerGroup from 'ol/layer/Group';
import {createDefaultMap} from '../../../../../util/map';
import MapWidget from '../../../../widget/map/MapWidget/MapWidget';
import LayerTreeSelect from '../../../../treeSelect/layer/LayerTreeSelect/LayerTreeSelect';
import NewOSMLayerButton from './NewOSMLayerButton';

//create a empty map
const createEmptyMap = () => {
    return(
        new Map({
            layers: [
                new LayerGroup({name:'Group 1'})
            ],
            view: new View({
                projection: 'EPSG:31370',
                center: [170000, 135000],
	            zoom: 9
            })
        })
    );
};

//create a new map and set a name for its layer group to be shown in the treeSelect
const map = useState(createEmptyMap())[0];
map.getLayerGroup().set('name', 'Layers');
const [selectedLayer, setSelectedLayer] = useState( map.getLayerGroup());
//the layer initially selected
const defaultLayer = map.getLayerGroup();

//Event handler called once the user selects layer in the components
const onSelectLayer = (layer) => {
    console.log('selected layer:', layer);
    setSelectedLayer(layer);
};

<div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:15}}>
    <div style={{display:'flex', gap:5}}>
        <LayerTreeSelect 
            style={{width:250}} 
            map={map} 
            onSelectLayer={onSelectLayer}
            defaultLayer={defaultLayer} 
        />
        {selectedLayer && selectedLayer instanceof(LayerGroup) &&
            <NewOSMLayerButton
                type="primary"
                map={map}
                wndStyle={{width:500, height:500}}
                parentLayerGroup={selectedLayer}
            >
                New OSM Layer
            </NewOSMLayerButton>
        }
    </div>
    {/* Map Component */}
    <MapWidget map={map} height='90%' width='100%'/>
</div>
```