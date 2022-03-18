<p>This Example shows the Layer Tree Component located in the left side:</p>

```js
import {createDefaultMap, createDefaultOverviewMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import LayerTree from './LayerTree';

//Create Map
const map = createDefaultMap();

<div style={{height: '500px', width: '100%'}}>
    <div style={{display:'flex', gap:5}}>
        <div style={{width:'30%'}}>
            {/* The LayerTree Component */}
            <LayerTree map={map}/>
        </div>
        <MapWidget map={map} height='500px' width='70%'/>
    </div>
</div>
```
