<p>This Example shows the creation of 2 Map Overview Controls located in the right side:</p>
<ol>
    <li>The box in the overview maps represent the view area of the parent map
        located in the left side.
    </li>
    <li>Drag and Drop the box in the overview map to pan</li>
    <li>Click in a point in the overview map to re-center</li>
    <li>The pan and zoom in the parent map will result in a 
        synchronization in the overview maps.
    </li>
</ol>

```js
import {createDefaultMap, createDefaultOverviewMap} from '../../../../util/map';
import MapWidget from '../MapWidget/MapWidget';
import MapOverviewWidget from './MapOverviewWidget';

const map = createDefaultMap();
const ovMap1 = createDefaultOverviewMap(map);
const ovMap2 = createDefaultOverviewMap(map);


<div style={{height: '500px', width: '100%'}}>
    <div style={{display:'flex', gap:5}}>
        <MapWidget map={map} height='500px' width='70%'/>
        <div style={{display:'flex', flexDirection:'column', gap:5, width:'30%'}}>
            <MapOverviewWidget map={ovMap1} parentMap={map}/>
            <MapOverviewWidget map={ovMap2} parentMap={map} magnification={10}/>
        </div>
    </div>
</div>
```
