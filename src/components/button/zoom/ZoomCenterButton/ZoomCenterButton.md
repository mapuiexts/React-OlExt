<p>To Zoom the map based on the center point and scale, click in the button <i>Zoom Center</i>:</p>
<ul>
    <li>
        The window will be shown with the selected coordinate with the same
        projection of the map (on this case it is EPSG:31378)
    </li>
    <li>
        Enter a coordinate to zoom, for instance: 151679.7, 211674.2
        using the projecttion EPSG:31378. Use the same default scale 
        or enter a different one.
    </li>
    <li>
        Click in the Zoom button and map will be zoomed taking in
        account the center coordinate and scale.
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
import ZoomCenterButton from './ZoomCenterButton';

const viewOpts= {
    projection: 'EPSG:31370',
    center: [157257, 172012],
    zoom: 18
};

//create map and array of projections
const map = createDefaultMap(viewOpts);
const projs = [map.getView().getProjection(), getProjection('EPSG:4326')];

<div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
    <ZoomCenterButton style={{width:'20%'}} type="primary" map={map} projs={projs}>Zoom Center</ZoomCenterButton>
    <MapWidget map={map} height='90%' width='100%'/>
</div>
```