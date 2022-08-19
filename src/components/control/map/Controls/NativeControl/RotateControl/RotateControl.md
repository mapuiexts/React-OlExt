<p>This Example shows the creation of the <i>Rotate Control</i>:</p>
<ul>
    <li>
        The component is initially added in the top right side, 
        inside the viewport's map:
    </li>
    <ul>
        <li>
            If the <i>target</i> element is not specified in
            the <i>options.target</i> property, the component 
            will be added inside the viewport's map.
        </li>
        <li>
            If the checkbox "Auto Hide Rotate Control" is selected,
            the options 'autoHide' is set to true in the component.
            So, it's mean that if the map IS NOT ROTATED, the 
            component will be hidden.
        </li>
    </ul>
    <li>
        Below you can see example.css used to style the
        component when outside the map.
    </li>
</ul>

```css
/* example.css: style used to show component outside the map */
.myRotateStyle button {
  background-color: rgba(255, 97, 24, 0.3);
}

.myRotateStyle.ol-hidden {
  opacity: 0;
  visibility: hidden;
  transition: opacity .25s linear, visibility 0s linear .25s;
}
```

```js
import {useState, useRef, useCallback} from 'react';
import {Checkbox} from 'antd';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import MapWidget from '../../../../../widget/map/MapWidget/MapWidget';
import RotateControl from './RotateControl';
import './example.css';


const map = new Map({
    layers: [
        new TileLayer({
            source: new OSM(),
        })
    ],
    controls: [],
    view: new View({
        projection: 'EPSG:4326',
        center: [4.47182278, 50.85845229],
        zoom: 20,
        rotation: Math.PI/6
    }),
});


const RotateControlExample = () => {

    //store reference on where the control will be placed outside the map
    const targetRef = useRef();

    //states
    const [showControl, setShowControl] = useState(true);
    const [options, setOptions] = useState({
        tipLabel: 'my reset rotation tooltip',
        autoHide: false
    });
   
    //callback fired once the user clicks the "show control" checkbox
    const onChangeShowControlCheckBox = (e) => {
        setShowControl(e.target.checked);
    };

    //callback fired once the user clicks the "Auto Hide" checkbox
    const onChangeAutoHideCheckBox = (e) => {
        setOptions({
            ...options,
            autoHide: e.target.checked
        });
    };

    //callback fired once the user clicks the "Control outside map" checkbox
    const onChangeOutsideMapCheckBox = (e) => {
        const isOutsideMap = e.target.checked;
        setOptions({
            ...options,
            target: isOutsideMap ? targetRef.current : undefined,
            className: isOutsideMap ? 'myRotateStyle' : undefined
        });
    };


    return (
        <div style={{display:'flex', flexDirection:'column', height: '500px', width: '100%', gap:5}}>
            <div style={{display:'flex', width:'80%', justifyContent:'space-between'}}>
                <Checkbox onChange={onChangeShowControlCheckBox} checked={showControl}>Show control</Checkbox>
                <Checkbox onChange={onChangeOutsideMapCheckBox} checked={ options.target}>Control outside map</Checkbox>
                <Checkbox onChange={onChangeAutoHideCheckBox} checked={ options.autoHide}>Auto Hide Rotate Control</Checkbox>
                {/* container to show the component outside the map*/}
                <div  ref={targetRef}/> 
            </div>
            <MapWidget map={map}>
                {showControl &&
                    <MapWidget.Controls>
                        <RotateControl 
                            map={map}
                            options={options}
                        />
                    </MapWidget.Controls>
                }
            </MapWidget>
        </div>
    );
};

<RotateControlExample/>

```