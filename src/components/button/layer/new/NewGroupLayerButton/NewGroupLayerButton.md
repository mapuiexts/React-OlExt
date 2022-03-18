<p>This Example shows how to use the <i>New Layer Group Button</i>.</p>
<p>
    Use the <i>Layer TreeSelect</i> component to select the Layer Group
    on where the new Layer Group will be added.
</p>
<p>Some steps to see how it works:</p>
<ul>
    <li>Select the Layer Group "Layers" in the TreeSelect</li>
    <li>Click in the button "New Layer Group</li>
    <li>
        In the new window, set the name of the layer group as
        "group 1" and click the <i>submit</i> button to create
        the new layer group.
    </li>
    <li>
        The TreeSelect will now have the newly created 
        layer group "group 1".
    </li>
    <li>
        Now select the previous created layer group "group 1" and
        create a new layer group names as "group 2".
    </li>
</ul>

```js
import {useState} from 'react';
import LayerGroup from 'ol/layer/Group';
import {createDefaultMap} from '../../../../../util/map';
import MapWidget from '../../../../widget/map/MapWidget/MapWidget';
import LayerTreeSelect from '../../../../treeSelect/layer/LayerTreeSelect/LayerTreeSelect';
import NewGroupLayerButton from './NewGroupLayerButton';


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
        {selectedLayer && selectedLayer instanceof(LayerGroup) &&
            <NewGroupLayerButton
                type="primary"
                map={map}
                wndStyle={{width:500, height:500}}
                parentLayerGroup={selectedLayer}
            >
                New Layer Group
            </NewGroupLayerButton>
        }
    </div>
    {/* Map Component */}
    <MapWidget map={map} height='90%' width='100%'/>
</div>
```