<p>Once the map is zoomed, the current scale will be shown:</p>

```js
import {createDefaultMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import CurrentScaleText from './CurrentScaleText';


const viewOpts= {
    projection: 'EPSG:31370',
    center: [157257, 172012],
    zoom: 18
};
//create map and vector layer
const map = createDefaultMap(viewOpts);
//custom component
const CurrentScaleTextExample = () => {
    return(
        <div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
            <div style={{display:'flex', height: '10%', width: '100%', alignItems: 'center'}}>
                <div><b>Scale:1/</b></div>
                <CurrentScaleText map={map} style={{color:'red', padding: '5px', fontWeight:'bold'}}/>
            </div>
            <MapWidget map={map} height='90%' width='100%'/>
        </div>
    );
};

<CurrentScaleTextExample/>
```