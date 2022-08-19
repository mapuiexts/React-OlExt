<p>This Example shows the creation of the <i>FullScreen Control</i>:</p>
<ul>
    <li>
        The component is initially added in the top right side, 
        inside the viewport's map. 
        the map
    </li>
    <ul>
        <li>
            If the <i>target</i> element is not specified in
            the <i>options.target</i> property, the component will be 
            added inside the viewport's map.
        </li>
    </ul>
    <li>
        Below you can see example.css used to style the
        component when outside the map.
    </li>
</ul>

```css
/* example.css: style used to show component outside the map */
.myFullScreenStyle button {
  background: rgba(255, 97, 24, 0.8);
  width: 100px;
}
```

```js
import {useState, useRef} from 'react';
import {Checkbox} from 'antd';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import MapWidget from '../../../../../widget/map/MapWidget/MapWidget';
import FullScreenControl from './FullScreenControl';
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

const FullScreenExample = () => {
    const targetRef = useRef();
    const [showControl, setShowControl] = useState(true);
    const [options, setOptions] = useState({
        
    });

    
    const onChangeShowControlCheckBox = (e) => {
        setShowControl(e.target.checked);
    };

    const onChangeOutsideMapCheckBox = (e) => {
        const isOutsideMap = e.target.checked;
        setOptions({
            ...options,
            target: isOutsideMap ? targetRef.current : undefined,
            className: isOutsideMap ? 'myFullScreenStyle' : undefined,
            label: isOutsideMap ? 'Full Screen' : undefined,
        });
    };


    return (
        <div style={{display:'flex', flexDirection:'column', height: '500px', width: '100%', gap:5}}>
            <div style={{display:'flex', width:'80%', justifyContent:'space-between'}}>
                <Checkbox onChange={onChangeShowControlCheckBox} checked={showControl}>Show control</Checkbox>
                <Checkbox onChange={onChangeOutsideMapCheckBox} checked={ options.target}>Control outside map</Checkbox>
                {/* container to show the component outside the map*/}
                <div  ref={targetRef}/> 
            </div>
            <MapWidget map={map}>
                {showControl &&
                    <MapWidget.Controls>
                        <FullScreenControl 
                            map={map}
                            options={options}
                        />
                    </MapWidget.Controls>
                }
            </MapWidget>
        </div>
    );
};

<FullScreenExample/>

```