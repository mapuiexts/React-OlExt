<p>This Example shows the creation of the <i>Zoom Control</i>:</p>
<ul>
    <li>
        The component is initially added in the top left side, 
        inside the viewport's map and it is composed by the
        Zoom In and Zoom Out buttons.
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
    <li>
        Notice that we created the ol/map with with controls
        as a empty array and later the ZooControl component
        is added (if controls is undefined, openlayers will
        add automatically the zoom control)
    </li>
</ul>

```css
/* example.css: style used to show component outside the map */
.myZoomStyle button {
  background-color: rgba(255, 97, 24, 0.3);
}
```

```js
import {useState, useRef, useCallback} from 'react';
import {Checkbox, InputNumber} from 'antd';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import MapWidget from '../../../../../widget/map/MapWidget/MapWidget';
import ZoomControl from './ZoomControl';
import {createStringXY, toStringHDMS, toStringXY} from 'ol/coordinate';
import './example.css';


const map = new Map({
    layers: [
        new TileLayer({
            source: new OSM(),
        })
    ],
    //map is created with empty controls and in the code below and
    //the zoom control is added later through the component <ZoomControl>.
    controls: [],
    view: new View({
        projection: 'EPSG:4326',
        center: [4.47182278, 50.85845229],
        zoom: 20
    }),
});


const ZoomControlExample = () => {

    //store reference on where the control will be placed outside the map
    const targetRef = useRef();

    //states
    const [showControl, setShowControl] = useState(true);
    const [options, setOptions] = useState({
        zoomInTipLabel: 'my Zoom In tooltip',
        zoomOutTipLabel: 'my Zoom Out tooltip',
        delta: 1
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
            className: isOutsideMap ? 'myZoomStyle' : undefined
        });
    };

    const onChangeDeltaInput = (value) => {
        setOptions({
            ...options,
            delta: value
        });
    }

    return (
        <div style={{display:'flex', flexDirection:'column', height: '500px', width: '100%', gap:5}}>
            <div style={{display:'flex', width:'80%', justifyContent:'space-between'}}>
                <Checkbox onChange={onChangeShowControlCheckBox} checked={showControl}>Show control</Checkbox>
                <Checkbox onChange={onChangeOutsideMapCheckBox} checked={ options.target}>Control outside map</Checkbox>
                {/* container to show the component outside the map*/}
                <div  ref={targetRef}/> 
            </div>
            <div>
                <span>Delta: </span>
                <InputNumber placeholder="delta" defaultValue={1} value={options.delta} onChange={onChangeDeltaInput} />
            </div>
            <MapWidget map={map}>
                {showControl &&
                    <MapWidget.Controls>
                        <ZoomControl 
                            map={map}
                            options={options}
                        />
                    </MapWidget.Controls>
                }
            </MapWidget>
        </div>
    );
};

<ZoomControlExample/>

```