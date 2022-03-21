<p>Example to show the usage of <i>Opacity Layer Slider</i>:</p>
<ul>
    <li>Initially the slider has the value of the current opacity for the layer provided as property in the Slider</li>
    <li>Change the slider value moving its cursor position: the layer opacity will change accordingly</li>
    <li>Change the layer opacity clicking in the button "Change Opacity to 0.5": the new opacity will be reflected in the slider</li>
</ul>

```js
import {Space, Button} from 'antd';
import {createDefaultMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import OpacityLayerSlider from './OpacityLayerSlider';

const viewOpts= {
    projection: 'EPSG:4326',
    center: [4.47182278, 50.85845229],
    zoom: 18
};
//create a default map with one layer (OSM layer)
const map = createDefaultMap(viewOpts);
//get the first layer (OSM layer)
const layer = map.getAllLayers()[0];

const OpacityLayerSliderExample = () => {

    const changeOpacityToHalfHandler = () => {
        layer.setOpacity(0.5);
    };

    return(
        <div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
            <Space>
                <Button type="primary" onClick={changeOpacityToHalfHandler}>Change Opacity to 0.5</Button>
                <OpacityLayerSlider layer={layer} style={{width:300}} step={0.05}/>
            </Space>
            <MapWidget map={map} width='100%'/>
        </div>
    );
};

<OpacityLayerSliderExample/>
```