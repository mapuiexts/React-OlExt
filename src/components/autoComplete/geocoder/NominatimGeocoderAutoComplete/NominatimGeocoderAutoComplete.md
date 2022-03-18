<p>Example to show the usage of <i>Nominatim Geocoder AutoComplete</i>:</p>
<ul>
    <li>Enter, for instance, "proximus tower" in the autocomplete component</li>
    <li>The component will show some options</li>
    <li>Select one of the options</li>
    <li>The selected place will be shown in the map</li>
</ul>
<p>
    Notice that, if you clear the value in the autocomplete component (using 
    the <i>close icon</i> or erasing it), the place will be removed from 
    the map.
</p>


```js
import {useState} from 'react';
import {Input, Checkbox} from 'antd';
import {createDefaultMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import FeaturePropertiesPopup from '../../../popup/feature/FeaturePropertiesPopup/FeaturePropertiesPopup';
import NominatimGeocoderAutoComplete from './NominatimGeocoderAutoComplete';

const viewOpts= {
    projection: 'EPSG:4326',
    center: [4.47182278, 50.85845229],
    zoom: 18
};
const map = createDefaultMap(viewOpts);

const NominatimGeocoderAutoCompleteExample = () => {
    const onSelectFeature = (value, feature, objFeature) => {
        console.log('Selected value', value);
        console.log('Selected Feature', feature);
        setFeature(objFeature);
        setPlaceName(feature.get('display_name'));
    };

    const onChangeCheckBox = (e) => {
        setIsPopupActive(e.target.checked);
    };

    const [feature, setFeature ] = useState(null);
    const [placeName, setPlaceName] = useState(null);
    const [isPopupActive, setIsPopupActive] = useState(true);

    return (
        <div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
            <div style={{display:'flex', gap:5}}>
                <div>Place Id:</div>
                <NominatimGeocoderAutoComplete 
                    map={map}
                    style={{width:'20%'}} 
                    onSelectFeature = {onSelectFeature}
                />
                <div>{placeName}</div>
                <Checkbox onChange={onChangeCheckBox} checked={isPopupActive}/>
                {isPopupActive &&
                    <FeaturePropertiesPopup map={map}/>
                }
            </div>
            <Input.TextArea 
                style={{height:'40%'}}
                value={feature ? JSON.stringify(feature, null, '\t') : null}
            />
            <MapWidget map={map} width='100%'/>
        </div>
    );
};
<NominatimGeocoderAutoCompleteExample/>

```