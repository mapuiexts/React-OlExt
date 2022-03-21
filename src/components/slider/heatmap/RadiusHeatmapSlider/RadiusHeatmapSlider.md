<p>Example to show the usage of <i>RadiusHeatmap Slider</i> to visualize the earthquakes magnitude:</p>
<ul>
    <li>Initially the slider has the value of the current radius for the heatmap layer provided as property in the Slider</li>
    <li>Change the slider value moving its cursor position: the heatmap layer radius will change accordingly</li>
    <li>Change the heatmap layer radius clicking in the button "Change Radius to 10": the new radius will be reflected in the slider</li>
</ul>

```js
import {Space, Button} from 'antd';
import Map from 'ol/Map';
import View from 'ol/View';
import {Heatmap as HeatmapLayer, Tile as TileLayer} from 'ol/layer';
import Stamen from 'ol/source/Stamen';
import VectorSource from 'ol/source/Vector';
import KML from 'ol/format/KML';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import RadiusHeatmapSlider from './RadiusHeatmapSlider';
import earthquakesKml from '../../../../assets/data/2012_Earthquakes_Mag5.kml';

//method to create heatmap layer
const createHeatmapLayer = () => {
    const vector = new HeatmapLayer({
    source: new VectorSource({
        url: earthquakesKml,
        format: new KML({
            extractStyles: false,
        }),
    }),
    blur: 10,
    radius: 10,
    weight: function (feature) {
        // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
        // standards-violating <magnitude> tag in each Placemark.  We extract it from
        // the Placemark's name instead.
        const name = feature.get('name');
        const magnitude = parseFloat(name.substr(2));
        return magnitude - 5;
    },
    });
    return vector;
};

//method to create the background stamen layer
const createStamenLayer = () => {
    const raster = new TileLayer({
        source: new Stamen({
            layer: 'toner',
        }),
    });
    return raster;
};

//create layers and map
const heatmapLayer = createHeatmapLayer();
const stamenLayer = createStamenLayer();
const map = new Map({
  layers: [stamenLayer, heatmapLayer],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});


const RadiusHeatmapSliderExample = () => {
    const changeRadiusToTen = () => {
        heatmapLayer.setRadius(10);
    };

    return(
        <div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:5}}>
            <Space>
                <Button type="primary" onClick={changeRadiusToTen}>Change Heatmap Radius to 10</Button>
                <RadiusHeatmapSlider heatmapLayer={heatmapLayer} min={1} max={50} step={1} style={{width:300}}/>
            </Space>
            <MapWidget map={map} width='100%'/>
        </div>
    );
};

<RadiusHeatmapSliderExample/>
```