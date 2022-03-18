<p>Example to show the usage of <i>Set Map Projection AutoComplete</i>:</p>
<ul>
    <li>
        The initial value is the current map projection 
        (belgium lambert projection) 
    </li>
    <li>Enter, for instance, a projection code, like "4326"</li>
    <li>The component will show the <i>projection name</i> "WGS 84"</li>
    <li>Select the projection name "WGS 84"</li>
    <li>
        The map will be re-projected to the selected projection.
    </li>
</ul>
<p>
    Additionally, if the map view is changed with a new projection, 
    the text in the AutoComplete component will change accordingly:
</p>
<ul>
    <li>click in the <i>Set Lambert Position</i> button</li>
    <li>
        the event handler <i>onClickSetBelMapProj</i> in the
        code below will set a new view to the map with a 
        Lambert projection. As result, the text in the 
        autocomplete component will be synchronized with
        the new projection.
    </li>
</ul>

```js
import {useState, useCallback} from 'react';
import {Button} from 'antd';
import View from 'ol/View';
import {get as getProjection} from 'ol/proj/projections';
import {createDefaultMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import SetMapProjectionAutoComplete from './SetMapProjectionAutoComplete';

//create a default map having the belgium lambert projection
const map = createDefaultMap();

const SetMapProjectionAutoCompleteExample = () => {

    const onClickSetBelMapProj = useCallback(() => {
        let projection =  getProjection('EPSG:31370');
        map.setView(
                new View({
                    projection: projection.getCode(),
                    center: [0, 0],
                    zoom: 10,
                })
            );
    }, [map]);

    const onSelectProjection = (value, projObj, proj) => {
        console.log('Selected Projection Object', projObj);
        console.log('Selected ol/Projection', proj);
    };

    const [projection, setProjection ] = useState(null);

    return (
        <div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
            <div style={{display:'flex', gap:5}}>
                <SetMapProjectionAutoComplete 
                    map={map}
                    style={{width:'50%'}} 
                    onSelectProjection = {onSelectProjection}
                />
                <Button type="primary" onClick={onClickSetBelMapProj}>Set Lambert Projection</Button>
            </div>
            <MapWidget map={map} height='80%' width='100%'/>
        </div>
    );
};
<SetMapProjectionAutoCompleteExample/>

```