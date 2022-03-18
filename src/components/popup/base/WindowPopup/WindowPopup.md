<p>Example to show the usage of <i>Window Popup</i>:</p>
<ul>
    <li>
        Initially, as the popup has a <i>undefined</i> position,
        it will not be visible in the map.
    </li>
    <li>Just click a position on the map</li>
    <li>
        The position will be retrieved from the map through 
        the function <i>onClickMap</i> that handle the
        'click' event in the map.
    </li>
    <li>The popup is shown in the indicated position.</li>
</ul>


```js
import {useState, useCallback, useEffect} from 'react';
import {Checkbox} from 'antd';
import {toLonLat} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';
import {createDefaultMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import WindowPopup from './WindowPopup';

//view options for the map
const viewOpts= {
    projection: 'EPSG:4326',
    center: [4.47182278, 50.85845229],
    zoom: 18
};

//create a basic map
const map = createDefaultMap(viewOpts);

const WindowPopupExample = () => {

    const [isPopupActive, setIsPopupActive] = useState(true);
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState(undefined);

    //disable the popup when the user
    //unchecks the checkbox
    const onChangeCheckBox = (e) => {
        setIsPopupActive(e.target.checked);
        setPosition(undefined);
    };

    //clear the position when the popup is closed
    const onClosePopup = () => {
        setPosition(undefined);
    }

    //Method to handle the 'click' event in the map.
    //This method will show the popup
    const onClickMap = (evt) => {
        if(isPopupActive) {
            console.log('click', evt.coordinate);
            setPosition(evt.coordinate);
        }
    };

    //content to be shown in the popup
    const content = (
        <div>
            <p>You clicked here:</p>
            {
                <>
                    <p>X: {position && position[0]}</p>
                    <p>Y: {position && position[1]}</p>
                </>
            }
        </div>
    );

    // Effect to register/unregister 'click' event in the map
    useEffect(() => {
        map.on('click', onClickMap);
        return () => map.un('click', onClickMap);
    }, [map, onClickMap]);

    

    return (
        <div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
            <div style={{display:'flex', gap:5}}>
                <div>Activate Popup:</div>
                <Checkbox onChange={onChangeCheckBox} checked={isPopupActive}/>
                {isPopupActive &&
                    <WindowPopup 
                        map={map}
                        title="Coordinate"
                        position={position}
                        onClose={onClosePopup}
                    >
                        {content}
                    </WindowPopup>
                }
            </div>
            <MapWidget map={map} width='100%'/>
        </div>
    );
};
<WindowPopupExample/>

```