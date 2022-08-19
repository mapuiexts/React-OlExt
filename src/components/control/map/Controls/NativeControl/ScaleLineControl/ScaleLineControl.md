<p>This Example shows the creation of the <i>ScaleLine Control</i>:</p>
<ul>
    <li>
        The component is initially added in the bottom left side, 
        inside the viewport's map. 
        the map
    </li>
    <ul>
        <li>
            If the <i>target</i> element is not specified in
            the <i>options</i> property out it is undefined, 
            the component will be added inside the viewport's map.
        </li>
    </ul>
    <li>
        Below you can see example.css used to style the
        component when outside the map.
    </li>
</ul>

```css
/* example.css: style used to show component outside the map */
.myScaleLineStyle {
  background: rgba(255, 97, 24, 0.8);
  border-radius: 4px;
  bottom: 8px;
  left: 8px;
  padding: 2px;
  color: #eee;
  text-align: center;
  border: 4px solid cyan;
  border-top: none;
}
```

```js
import {useState, useRef} from 'react';
import {Checkbox, Radio} from 'antd';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import MapWidget from '../../../../../widget/map/MapWidget/MapWidget';
import ScaleLineControl from './ScaleLineControl';
import 'ol/ol.css';
import './example.css';


const map = new Map({
    layers: [
        new TileLayer({
            source: new OSM(),
        })
    ],
    view: new View({
        projection: 'EPSG:31370',
        center: [170000, 135000],
        zoom: 15
    }),
});

const ScaleLineExample = () => {
    const targetRef = useRef();
    const [showControl, setShowControl] = useState(true);
    const [options, setOptions] = useState({
        units: 'metric',
        bar: false
    });

    
    const onChangeShowControlCheckBox = (e) => {
        setShowControl(e.target.checked);
    };

    const onChangeOutsideMapCheckBox = (e) => {
        const isOutsideMap = e.target.checked;
        setOptions({
            ...options,
            target: isOutsideMap ? targetRef.current : undefined,
            className: isOutsideMap ? 'myScaleLineStyle' : undefined,
        });
    };

    const onSetBarCheckBox = (e) => {
        setOptions({
            ...options,
            bar: e.target.checked
        });
    };

    const onChangeUnitsRadio = (e) => {
        setOptions({
            ...options,
            units: e.target.value
        });
    };

    return (
        <div style={{display:'flex', flexDirection:'column', height: '500px', width: '100%', gap:5}}>
            <div style={{display:'flex', width:'80%', justifyContent:'space-between'}}>
                <Checkbox onChange={onChangeShowControlCheckBox} checked={showControl}>Show control</Checkbox>
                <Checkbox onChange={onSetBarCheckBox} checked={options.bar}>Bar</Checkbox>
                <Checkbox onChange={onChangeOutsideMapCheckBox} checked={ options.target}>Control outside map</Checkbox>
                {/* container to show the component outside the map*/}
                <div  ref={targetRef}/> 
            </div>
            <Radio.Group onChange={onChangeUnitsRadio} value={options.units}>
                <Radio value={'metric'}>Metric</Radio>
                <Radio value={'imperial'}>Imperial</Radio>
                <Radio value={'degrees'}>Degrees</Radio>
                <Radio value={'us'}>US</Radio>
                <Radio value={'nautical'}>Nautical</Radio>
            </Radio.Group>
            <MapWidget map={map}>
                {showControl &&
                    <MapWidget.Controls>
                        <ScaleLineControl 
                            map={map}
                            options={options}
                        />
                    </MapWidget.Controls>
                }
            </MapWidget>
        </div>
    );
};

<ScaleLineExample/>

```