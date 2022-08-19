<p>This Example shows the creation of the <i>Zoom Slider Control</i>:</p>
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
/* example.css: style used to show component with different style */
.myStyle1 {
    top: 4.5em;
    left: .5em;
    height: 200px;
    background-color: rgba(24, 144, 255, 0.4);
    border:5px;
    border-width: 5px;
}

.myStyle1 button {
    position: relative;
    height: 10px;
    background-color: rgb(255, 0, 0, 1);
    
  }

  .myStyle1 button:hover {
    background-color: rgb(255, 0, 0, 0.5);
    
  }

  .myStyle1:hover {
    background-color: rgba(128,128,128,0.5);
  }
  
   .ol-touch .myStyle1 {
    top: 5.5em;
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
import ZoomSliderControl from './ZoomSliderControl';
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

const ZoomSliderExample = () => {
    const targetRef = useRef();
    const [showControl, setShowControl] = useState(true);
    const [cssStyle, setCssStyle] = useState(false);
    const [options, setOptions] = useState({
        extent: [
            14637.25, 22608.21,
            291015.29, 246424.28
        ],
    });

    
    const onChangeShowControlCheckBox = (e) => {
        setShowControl(e.target.checked);
    };

    const onChangeCssStyleCheckBox = (e) => {
        const value = e.target.checked;
        setOptions({
            ...options,
            className: value ? 'myStyle1' : undefined,
        });
        setCssStyle(value);
    };

    return (
        <div style={{display:'flex', flexDirection:'column', height: '500px', width: '100%', gap:5}}>
            <div style={{display:'flex', width:'80%', justifyContent:'space-between'}}>
                <Checkbox onChange={onChangeShowControlCheckBox} checked={showControl}>Show control</Checkbox>
                {showControl &&
                    <Checkbox 
                        onChange={onChangeCssStyleCheckBox} 
                        checked={cssStyle}
                    >
                            Change CSS Style
                    </Checkbox>
                }
                {/* container to show the component outside the map*/}
                <div  ref={targetRef}/> 
            </div>
            <MapWidget map={map}>
                {showControl &&
                    <MapWidget.Controls>
                        <ZoomSliderControl 
                            map={map}
                            options={options}
                        />
                    </MapWidget.Controls>
                }
            </MapWidget>
        </div>
    );
};

<ZoomSliderExample/>

```