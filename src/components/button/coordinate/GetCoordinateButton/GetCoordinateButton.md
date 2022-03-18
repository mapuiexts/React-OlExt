<p>To Retrieve the coordinate, click in the button <i>Get Coordinate</i>:</p>
<ul>
    <li>
        The application will ask to pick a coordinate. So, click a position in the
        map with the mouse.
    </li>
    <li>
        The window will be shown with the selected coordinate with the same
        map projection (on this case it is EPSG:31378)
    </li>
    <li>
        Select the projection EPSG:4326 in the combo box. The
        coordinate will be automatically converted to the selected projection.
    </li>
    <li>
        You can copy to clipboard the coordinate using the <i>Copy</i> button.
    </li>
    <li>
        <i>Remark:</i> if you copy the coordinate with projection EPSG:4326, you can
        paste it in the google map to find the same position on this map.
    </li>
</ul>

```js
import {get as getProjection} from 'ol/proj';
import {createDefaultMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import GetCoordinateButton from './GetCoordinateButton';

const viewOpts= {
    projection: 'EPSG:31370',
    center: [157257, 172012],
    zoom: 18
};

//create map and array of projections
const map = createDefaultMap(viewOpts);
const projs = [map.getView().getProjection(), getProjection('EPSG:4326')];

<div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
    <GetCoordinateButton style={{width:'20%'}} type="primary" map={map} projs={projs}>Get Coordinate</GetCoordinateButton>
    <MapWidget map={map} height='90%' width='100%'/>
</div>
```