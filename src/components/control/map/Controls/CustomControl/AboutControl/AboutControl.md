This example shows the creation of *About Button Control*.
- By default the button will be created in a certain position.
- You can change the default position by specifying in a css file the attributes top, left, right and/or bottom.
    - Below you can see the example.css used on this example to specify the required position.

```css
.rolext-about-control {
    top: 0.5em;
    left: 2.5em;
}
```
***
Here is the result for the code below:

```js
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import MapWidget from '../../../../../widget/map/MapWidget/MapWidget';
import AboutControl from './AboutControl';
import './example.css';

//create the openlayers map
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

//my application with the control
const AboutControlApp = () => {
    return(
        <div style={{display:'flex', flexDirection:'column', height: '500px', width: '100%', gap:5}}>
            <MapWidget map={map}>
                <MapWidget.Controls>
                    <AboutControl map={map} content={<div>Hello</div>}/>
                </MapWidget.Controls>
            </MapWidget>
        </div>
    );
};

<AboutControlApp/>
```