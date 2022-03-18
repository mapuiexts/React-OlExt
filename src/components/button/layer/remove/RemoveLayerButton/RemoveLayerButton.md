<p>This Example shows the <i>Remove Layer Button</i> component.</p>
<p>Also, the <i>Layer TreeSelect</i> is being used to select the layer to be removed</p>

```js
import {useState} from 'react';
import GroupLayer from 'ol/layer/Group';
import {createDefaultMap} from '../../../../../util/map';
import MapWidget from '../../../../widget/map/MapWidget/MapWidget';
import LayerTreeSelect from '../../../../treeSelect/layer/LayerTreeSelect/LayerTreeSelect';
import RemoveLayerButton from './RemoveLayerButton';


//create a new map and set a name for its layer group to be shown in the treeSelect
const map = useState(createDefaultMap())[0];
map.getLayerGroup().set('name', 'Layers');
const [selectedLayer, setSelectedLayer] = useState(null);


//Event handler called once the user selects layer in the treeSelect
const onSelectLayer = (layer) => {
    console.log('selected layer:', layer);
    setSelectedLayer(layer);
};

<div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
    <div style={{display:'flex', gap:15}}>
        <p>Layer to remove:</p>
        <LayerTreeSelect style={{width:200}} map={map} onSelectLayer={onSelectLayer}/>
        <RemoveLayerButton 
            disabled={!selectedLayer || selectedLayer instanceof(GroupLayer)} 
            type="primary" 
            map={map}
            layer={selectedLayer}
        >
            Remove Layer
        </RemoveLayerButton>
    </div>
    {/* Map Component */}
    <MapWidget map={map} height='90%' width='100%'/>
</div>
```