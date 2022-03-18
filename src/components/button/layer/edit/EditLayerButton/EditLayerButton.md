<p>This Example shows how to use the <i>Edit Layer Button</i>.</p>
<p>Some steps to see how it works:</p>
<ul>
    <li>Select the Layer "OSM" in the TreeSelect</li>
    <li>Click in the button <i>Edit Layer</i></li>
    <li>Edit the attributes in the window. For instance, in the <i>General</i> tab:</li>
    <ul>
        <li>
            Change the layer name as, for instance, "OpenStreet Map".
        </li>
        <li>
            Change the <i>opacity</i> to "0.5"
        </li>
    </ul>
    <li>
        click the <i>submit</i> button to apply the changes in the layer.
    </li>
    <li>
        The TreeSelect will now have the layer with the updated name 
        and the map will show the layer with the new opacity.
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
import EditLayerButton from './EditLayerButton';


//create a new map and set a name for its layer group to be shown in the treeSelect
const map = useState(createDefaultMap())[0];
map.getLayerGroup().set('name', 'Layers');
const [selectedLayer, setSelectedLayer] = useState( map.getLayerGroup());
//the layer initially selected
const defaultLayer = map.getLayerGroup();

//Event handler called once the user selects layer in the components
const onSelectLayer = (layer) => {
    console.log('layer selected:', layer);
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
        {
            <EditLayerButton
                type="primary"
                disabled={selectedLayer instanceof(LayerGroup)}
                layer={selectedLayer}
                wndStyle={{width:500, height:500}}
            >
                Edit Layer
            </EditLayerButton>
        }
    </div>
    {/* Map Component */}
    <MapWidget map={map} height='90%' width='100%'/>
</div>
```