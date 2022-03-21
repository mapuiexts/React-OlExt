<p>Example to show the usage of <i>Map Projection Select</i>:</p>
<ul>
    <li>Initially the Select has the value of the map projection</li>
    <li>Change the projection in the Select component: the map projection will be automatically changed to the selected projection</li>
    <li>Change the map projection clicking in the button "Change Projection to EPSG:31370": the new map projection will be selected in the Select component</li>
</ul>

```js
import {useCallback} from 'react';
import {Space, Button} from 'antd';
import {createDefaultMap} from '../../../../util/map';
import View from 'ol/View';
import {get as getProjection, transform} from 'ol/proj';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import MapProjectionSelect from './MapProjectionSelect';


const viewOpts= {
    projection: 'EPSG:4326',
    center: [4.47182278, 50.85845229],
    zoom: 18
};
//create a default map with one layer (OSM layer)
const map = createDefaultMap(viewOpts);
//projections to be added in Select component
const projs= [getProjection('EPSG:31370'), getProjection('EPSG:4326')];


const MapProjectionSelectExample = () => {

    // handler to assign a new view to the map with lambert projection
    // fired when the user clicks the button
    const changeProjectionToLambert = () => {
        //get the current map projection code
        const mapProjectionCode = map.getView().getProjection().getCode();
        //get lambert projection
        let lambertProjection =  getProjection('EPSG:31370');
        if(mapProjectionCode !== lambertProjection.getCode()) {
            const zoom = map.getView().getZoom();
            const center = map.getView().getCenter();
            //transform coordinate to lambert projection
            const transformedCenter = transform(center, mapProjectionCode, lambertProjection.getCode());
            map.setView(
                new View({
                    projection: lambertProjection.getCode(),
                    center: transformedCenter,
                    zoom: zoom,
                })
            );
        }
    };

    return(
        <div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
            <Space>
                <Button type="primary" onClick={changeProjectionToLambert}>Change Projection to EPSG:31370</Button>
                <MapProjectionSelect map={map} projs={projs} style={{width:300}}/>
            </Space>
            <MapWidget map={map} width='100%'/>
        </div>
    );
};

<MapProjectionSelectExample/>
```