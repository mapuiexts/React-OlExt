<p>This Example shows the creation of the <i>Mouse Position Control</i>:</p>
<ul>
    <li>
        The component is initially added in the top right side, 
        inside the viewport's map. 
        the map
    </li>
    <ul>
        <li>
            If the <i>target</i> element is not specified in
            the <i>options.target</i> property, the component 
            will be added inside the viewport's map.
        </li>
    </ul>
    <li>
        Below you can see example.css used to style the
        component when outside the map.
    </li>
</ul>

```css
/* example.css: style used to show component outside the map */
.myMousePositionStyle {
  background: rgba(255, 97, 24, 0.3);
  width: 300px;
  border-style: inset;
}
```

```js
import {useState, useRef, useCallback} from 'react';
import {Checkbox, Radio} from 'antd';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import MapWidget from '../../../../../widget/map/MapWidget/MapWidget';
import MousePositionControl from './MousePositionControl';
import {createStringXY, toStringHDMS, toStringXY} from 'ol/coordinate';
import 'ol/ol.css';
import './example.css';


const map = new Map({
    layers: [
        new TileLayer({
            source: new OSM(),
        })
    ],
    view: new View({
        projection: 'EPSG:4326',
        center: [4.47182278, 50.85845229],
        zoom: 20
    }),
});

const MousePositionExample = () => {
     //method to return a function to format the coordinate
    const formatCoordinateFunc = (digits, isHDMS) => {
        if(isHDMS) {
            return (coord) => {
                return toStringHDMS(coord, digits)
            }
        }
        else {
            return (coord) => {
               return toStringXY(coord, digits)
            }
        }
    };
    //store reference on where the control will be placed outside the map
    const targetRef = useRef();

    //states
    const [fractionalDigits, setFractionalDigits] = useState(5);
    const [showControl, setShowControl] = useState(true);
    const [isHDMSFormat, setIsHDMSFormat] = useState(false);
    const [isWGS84Proj, setIsWGS84Proj] = useState(true);
    const [options, setOptions] = useState({
        coordinateFormat: formatCoordinateFunc(fractionalDigits, isHDMSFormat)
    });
   
    //callback fired once the user clicks the "show control" checkbox
    const onChangeShowControlCheckBox = (e) => {
        setShowControl(e.target.checked);
    };

    //callback fired once the user clicks the "Control outside map" checkbox
    const onChangeOutsideMapCheckBox = (e) => {
        const isOutsideMap = e.target.checked;
        setOptions({
            ...options,
            target: isOutsideMap ? targetRef.current : undefined,
            className: isOutsideMap ? 'myMousePositionStyle' : undefined,
        });
    };

    //callback fired once the user clicks the radio to define the 
    //number of digits to be shown in the coordinate
    const onChangeFractionalDigitsRadio = (e) => {
        setFractionalDigits(e.target.value);
        setOptions({
            ...options,
           coordinateFormat: formatCoordinateFunc(e.target.value, isHDMSFormat)
        });
    };

     //callback fired once the user clicks the "WGS 84 Projection" checkbox
    const onChangeIsWGS84ProjCheckBox = (e) => {
        setIsWGS84Proj(e.target.checked);
        if(e.target.checked) {
            setOptions({
                ...options,
                projection: 'EPSG:4326'
            });
        }
        else {
            setOptions({
                ...options,
                projection: 'EPSG:31370'
            });
        }
    };

     //callback fired once the user clicks the "HDMS Format" checkbox
    const onChangeIsHDMSFormatCheckBox = (e) => {
        setIsHDMSFormat(e.target.checked);
        setOptions({
            ...options,
           coordinateFormat: formatCoordinateFunc(fractionalDigits, e.target.checked)
        });
    };

    return (
        <div style={{display:'flex', flexDirection:'column', height: '500px', width: '100%', gap:5}}>
            <div style={{display:'flex', width:'80%', justifyContent:'space-between'}}>
                <Checkbox onChange={onChangeShowControlCheckBox} checked={showControl}>Show control</Checkbox>
                <Checkbox onChange={onChangeIsHDMSFormatCheckBox} checked={isHDMSFormat}>HDMS Format</Checkbox>
                <Checkbox onChange={onChangeOutsideMapCheckBox} checked={ options.target}>Control outside map</Checkbox>
                <Checkbox onChange={onChangeIsWGS84ProjCheckBox} checked={isWGS84Proj}>WGS 84 Projection</Checkbox>
                {/* container to show the component outside the map*/}
                <div  ref={targetRef}/> 
            </div>
            <Radio.Group onChange={onChangeFractionalDigitsRadio} value={fractionalDigits}>
                <Radio value={3}>3 Digits</Radio>
                <Radio value={4}>4 Digits</Radio>
                <Radio value={5}>5 Digits</Radio>
                <Radio value={6}>6 Digits</Radio>
                <Radio value={7}>7 Digits</Radio>
            </Radio.Group>
            <MapWidget map={map}>
                {showControl &&
                    <MapWidget.Controls>
                        <MousePositionControl 
                            map={map}
                            options={options}
                        />
                    </MapWidget.Controls>
                }
            </MapWidget>
        </div>
    );
};

<MousePositionExample/>

```