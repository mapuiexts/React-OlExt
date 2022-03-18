<p>This Example shows how to use the <i>New Image WMS Layer Button</i>.</p>
<p>
    Use the <i>Layer TreeSelect</i> component to select the Layer Group
    on where the new Image WMS Layer will be added.
</p>
<p>Some steps to see how it works:</p>
<ul>
    <li>Select the Layer Group "Layers" ou "Group 1" in the TreeSelect</li>
    <li>Click in the button "New Image WMS Layer</li>
    <li>Fill the window using the following attributes in the <i>General</i> tab:</li>
    <ul>
        <li>
            Enter the layer name as, for instance, "GRB".
        </li>
    </ul>
    <li>Fill the window using the following attributes in the <i>Source</i> tab:</li>
    <ul>
        <li>
            Enter the <i>URL</i> 
            as "https://geoservices.informatievlaanderen.be/raadpleegdiensten/GRB-selectie/wms"
        </li>
        <li>
            Enter the <i>Layers</i> as "GRB_BSK".
        </li>
    </ul>
    <li>
        click the <i>submit</i> button to create the new Image WMS layer.
    </li>
    <li>
        The TreeSelect will now have the newly created 
        ImageWMS layer and the map will show this layer.
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
import NewImageWMSLayerButton from './NewImageWMSLayerButton';

//create a empty map
const createEmptyMap = () => {
    return(
        new Map({
            layers: [
                new LayerGroup({name:'Group 1'})
            ],
            view: new View({
                projection: 'EPSG:31370',
                center: [157257, 172012],
                zoom: 18
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
            <NewImageWMSLayerButton
                type="primary"
                map={map}
                wndStyle={{width:500, height:500}}
                parentLayerGroup={selectedLayer}
            >
                New Image WMS Layer
            </NewImageWMSLayerButton>
        }
    </div>
    {/* Map Component */}
    <MapWidget map={map} height='90%' width='100%'/>
</div>
```