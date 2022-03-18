<p>This Example shows the creation of a <i>Custom Control</i>:</p>
<ul>
    <li>
        The component is initially added in the right side, 
        inside the viewport's map:
    </li>
    <ul>
        <li>
            If the <i>target</i> element is not specified in
            the <i>options.target</i> property, the component 
            will be added inside the viewport's map.
        </li>
        <li>
            On this example, in the custom control was added the 
            <i>About Button</i> component.
        </li>
    </ul>
    <li>
        Below you can see example.css used to style the
        component when outside the map.
    </li>
</ul>

```css
/* example.css: style used to show component outside the map */
.myCustomControlStyle {
  opacity: 0.5;
  top: 4.5em;
  left:0.2em;
}
```

```js
import {useState, useRef, useCallback} from 'react';
import {Checkbox, InputNumber} from 'antd';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import MapWidget from '../../../../widget/map/MapWidget/MapWidget';
import CustomControl from './CustomControl';
import AboutButton from '../../../../button/common/AboutButton/AboutButton';
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
        zoom: 20,
    }),
});


const CustomControlExample = () => {

    //store reference on where the control will be placed outside the map
    const targetRef = useRef();

    //states
    const [showControl, setShowControl] = useState(true);
    const [options, setOptions] = useState({
       target: undefined,
       className: 'myCustomControlStyle'
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
            className: isOutsideMap ? undefined : 'myCustomControlStyle'
        });
    };


    return (
        <div style={{display:'flex', flexDirection:'column', height: '500px', width: '100%', gap:5}}>
            <div style={{display:'flex', width:'80%', justifyContent:'space-between'}}>
                <Checkbox onChange={onChangeShowControlCheckBox} checked={showControl}>Show control</Checkbox>
                <Checkbox onChange={onChangeOutsideMapCheckBox} checked={ options.target}>Control outside map</Checkbox>
                {/* container to show the component outside the map*/}
                <div  ref={targetRef} />
            </div>
            <MapWidget map={map}>
                {showControl &&
                    <MapWidget.Controls>
                        <CustomControl map={map} options={options}>
                            <AboutButton type="primary">?</AboutButton>
                        </CustomControl>
                    </MapWidget.Controls>
                }
            </MapWidget>
        </div>
    );
};

<CustomControlExample/>

```