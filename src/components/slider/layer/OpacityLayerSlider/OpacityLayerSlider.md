<p>Example to show the usage of <i>Opacity Layer Slider</i>:</p>
<ul>
    <li>Change the slider value moving its cursor position: the layer opacity will change accordingly</li>
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
console.log(layer);

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