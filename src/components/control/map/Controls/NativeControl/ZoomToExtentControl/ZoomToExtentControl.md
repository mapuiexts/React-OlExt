<p>This Example shows the creation of the <i>Zoom to Extent Control</i>:</p>
<ul>
    <li>
        The component is initially added in the left side of 
        the map: the button <i>E</i>
    </li>
    <ul>
        <li>
            If the <i>target</i> element is not specified in
            the <i>options</i> property out it is undefined, 
            the component will be added inside the viewport's map.
        </li>
    </ul>
    <li>
        As the projection for the map is EPSG:31370, 
        you can get the maximum extents for this projection
        in the related link <a href="https://epsg.io/31370">
        epsg.io/31370</a>
    </li>
    <li>
        Below you can see example.css used to style the
        component when outside the map.
    </li>
</ul>

```css
<!- example.css: style used to show component outside the map->
.myStyle button {
    background-color: #1890ff;
    background: #1890ff;
    color: white;
    width: 120px;
    border:5px;
    font-size: 15px;
    font-weight: normal;
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
import ZoomToExtentControl from './ZoomToExtentControl';
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

const ZoomToExtentExample = () => {
    const targetRef = useRef();
    const [showControl, setShowControl] = useState(true);
    const [outsideMap, setOutsideMap] = useState(false);
    const [options, setOptions] = useState({
        extent: [
            14637.25, 22608.21,
            291015.29, 246424.28
        ],
    });

    
    const onChangeShowControlCheckBox = (e) => {
        setShowControl(e.target.checked);
    };

    const onChangeOutsideMapCheckBox = (e) => {
        const isOutsideMap = e.target.checked;
        console.log('targetRef.current ', targetRef.current);
        setOptions({
            ...options,
            target: isOutsideMap ? targetRef.current : undefined,
            className: isOutsideMap ? 'myStyle' : undefined,
            label: isOutsideMap ? 'Zoom Extent' : undefined,
            tipLabel: isOutsideMap ? 'Fit to extent (outside map)' : undefined
        });
        setOutsideMap(isOutsideMap);
    };

    return (
        <div style={{display:'flex', flexDirection:'column', height: '500px', width: '100%', gap:5}}>
            <div style={{display:'flex', width:'80%', justifyContent:'space-between'}}>
                <Checkbox onChange={onChangeShowControlCheckBox} checked={showControl}>Show control</Checkbox>
                {showControl &&
                    <Checkbox onChange={onChangeOutsideMapCheckBox} checked={outsideMap}>Control outside map</Checkbox>
                }
                {/* container to show the component outside the map*/}
                <div  ref={targetRef}/> 
            </div>
            <MapWidget map={map}>
                {showControl &&
                    <MapWidget.Controls>
                        <ZoomToExtentControl 
                            map={map}
                            options={options}
                        />
                    </MapWidget.Controls>
                }
            </MapWidget>
        </div>
    );
};

<ZoomToExtentExample/>

```