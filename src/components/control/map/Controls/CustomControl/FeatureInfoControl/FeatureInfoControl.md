This example shows the creation of *Feature Info Control*.
- By default the button will be created in a certain position.
- You can change the default position by specifying in a css file the attributes top, left, right and/or bottom.
    - Below you can see the example.css used on this example to specify the required position.

```css
.rolext-feature-info-control {
    top: 0.5em;
    right: 0.5em;
}
```
***
As specified in the css file, the button is located at the top right of the map:
- Click in the control
- Select a building in the map to retrieve the building's attributes

```js
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import ImageWMSSource from 'ol/source/ImageWMS';
import View from 'ol/View';
import MapWidget from '../../../../../widget/map/MapWidget/MapWidget';
import FeatureInfoControl from './FeatureInfoControl';
import './example.css';

//create the openlayers map (openstreet map + flemish buildings)
const map = new Map({
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
        new ImageLayer({
            source: new ImageWMSSource({
                url: 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/Gebouwenregister/wms',
                params: {
                    STYLE: '',
                    LAYERS: 'G_GEREALISEERD',
                    INFO_FORMAT: 'application/vnd.esri.wms_featureinfo_xml'
                }
            })
        }),
    ],
    view: new View({
        projection: 'EPSG:4326',
        center: [4.47182278, 50.85845229],
        zoom: 20,
    }),
});

//my application with the control
const FeatureInfoControlApp = () => {
    return(
        <div style={{display:'flex', flexDirection:'column', height: '500px', width: '100%', gap:5}}>
            <MapWidget map={map}>
                <MapWidget.Controls>
                    <FeatureInfoControl map={map}/>
                </MapWidget.Controls>
            </MapWidget>
        </div>
    );
};

<FeatureInfoControlApp/>
```