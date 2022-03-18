<p>If the mouse pointer on the map, the coordinate of the mouse will be shown for the current map projection:</p>

```js
import {createDefaultMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import CurrentCoordinateText from './CurrentCoordinateText';


const viewOpts= {
    projection: 'EPSG:31370',
    center: [157257, 172012],
    zoom: 18
};

//create map and vector layer
const map = createDefaultMap(viewOpts);

//custom component
const CurrentCoordinateTextExample = () => {
    return(
        <div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
            <CurrentCoordinateText map={map} style={{height:'5%', width:'20%', background:'blue', color:'white', padding: '5px'}}/>
            <MapWidget map={map} height='95%' width='100%'/>
        </div>
    );
};

<CurrentCoordinateTextExample/>
```