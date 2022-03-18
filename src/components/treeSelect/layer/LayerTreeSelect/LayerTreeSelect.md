<p>This Example shows the Layer TreeSelect Component located in the top:</p>

```js
import {useState} from 'react';
import {createDefaultMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import LayerTreeSelect from './LayerTreeSelect';



const map = useState(createDefaultMap())[0];
const [selectedLayer, setSelectedLayer] = useState( map.getLayerGroup().getLayers().getArray()[0]);
//the layer initially selected
const defaultLayer = map.getLayerGroup().getLayers().getArray()[0];

//Event handler called once the user selects layer in the components
const onSelectLayer = (layer) => {
    console.log('selected layer:', layer);
    setSelectedLayer(layer);
};

<div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:15}}>
    <div style={{display:'flex', gap:5}}>
        {/* The LayerTreeSelect Component */}
        <LayerTreeSelect 
            style={{width:250}} 
            map={map} 
            onSelectLayer={onSelectLayer}
            defaultLayer={defaultLayer}
        />
        <p>Selected Layer:</p>
        <p>{selectedLayer && selectedLayer.get('name')}</p>
    </div>
    {/* Map Component */}
    <MapWidget map={map} height='90%' width='100%'/>
</div>
```