<p>This Example shows the creation of a simple Map Control.</p>

```js
import {createDefaultMap} from '../../../../util/map';
import MapWidget from './MapWidget';
const map = createDefaultMap();


<div style={{height: '500px', width: '100%'}}>
    <MapWidget map={map}/>
</div>
```
