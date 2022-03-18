<p>This Example shows how to use the <i>WMS GetFeatureInfo Button</i>.</p>
<p>
    Three WMS layers are used from 
    <a href="https://overheid.vlaanderen.be/webdiensten-raadpleegdiensten#wms">Informatie Vlanderen</a>:
</p>
<ul>
    <li>Addresses: represented by a gray circle</li>
    <li>Building: represented by a red polygon</li>
    <li>Parcel: represented by a yellow polygon</li>
</ul>
<p>
    Use the <i>Layer TreeSelect</i> component to select the Layer
    to retrieve the feature information. If a layer group is selected,
    the feature information is retrieved from all the layers inside it.
</p>
<p>Some steps to see how it works:</p>
<ul>
    <li>Select the Layer Group "Layers" in the TreeSelect</li>
    <li>Click in the button "Info</li>
    <li>Select an address (gray circle) using the mouse</li>
    <li>
        A window will be shown with all the features located in the indicated position:
    </li>
    <ul>
        <li>
            As you have selected the layer group "Layers", 
            the application will search for all the layers on 
            this group (address, building and parcel). 
        </li>
        <li>
            As you have selected an address, in the same position we can
            find its building and parcel. So, all of them will be retrieved. 
            Click on the tab located in the top of the window to navigate 
            to the retrieved features.
        </li>
    </ul> 
</ul>

```js
import {useState} from 'react';
import {InfoOutlined} from '@ant-design/icons';
import Map from 'ol/Map';
import View from 'ol/View';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import OSMSource from 'ol/source/OSM';
import ImageWMSSource from 'ol/source/ImageWMS';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import LayerTreeSelect from '../../../treeSelect/layer/LayerTreeSelect/LayerTreeSelect';
import WmsGetFeatureInfoButton from './WmsGetFeatureInfoButton';

//create a map with 3 WMS Layers
const createMap = () => {
    return(
        new Map({
            layers: [
                new TileLayer({
                    name: 'OSM',
                    source: new OSMSource(),
                    zIndex: 0
                }),
                new ImageLayer({
                    name: 'GRB Parcel',
                    source: new ImageWMSSource({
                        url: 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/Adpf/wms',
                        params: {
                            STYLES: '',
                            LAYERS: 'Adpf',
                            INFO_FORMAT: 'application/vnd.esri.wms_featureinfo_xml'
                        }
                    })
                }),
                new ImageLayer({
                    name: 'GRB Building',
                    source: new ImageWMSSource({
                        url: 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/Gebouwenregister/wms',
                        params: {
                            STYLES: '',
                            LAYERS: 'G_GEREALISEERD',
                            INFO_FORMAT: 'application/vnd.esri.wms_featureinfo_xml'
                        }
                    })
                }),
                new ImageLayer({
                    name: 'GRB Address',
                    source: new ImageWMSSource({
                        url: 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/Adressen/wms',
                        params: {
                            STYLES: '',
                            LAYERS: 'Adrespos',
                            INFO_FORMAT: 'application/vnd.esri.wms_featureinfo_xml'
                        }
                    })
                })
            ],
            view: new View({
                projection: 'EPSG:4326',
                center: [4.47182278, 50.85845229],
                zoom: 20
            })
        })
    );
};

//create a new map and set a name for its layer group to be shown in the treeSelect
const map = useState(createMap())[0];
map.getLayerGroup().set('name', 'Layers');
const [selectedLayers, setSelectedLayers] = useState( [map.getLayerGroup()]);
//the layer initially selected
const defaultLayer = map.getLayerGroup();

//Event handler called once the user selects layer in the components
const onSelectLayer = (layer) => {
    console.log('selected layer:', layer);
    setSelectedLayers([layer]);
};

<div style={{display:'flex', height:'500px', width: '100%', flexDirection: 'column', gap:15}}>
    <div style={{display:'flex', gap:5}}>
        <LayerTreeSelect 
            style={{width:250}} 
            map={map} 
            onSelectLayer={onSelectLayer}
            defaultLayer={defaultLayer} 
        />
        {selectedLayers &&
            <WmsGetFeatureInfoButton
                type="primary"
                shape="circle"
                icon= <InfoOutlined/>
                map={map}
                wndStyle={{width:500}}
                layers={selectedLayers}
            />
        }
    </div>
    {/* Map Component */}
    <MapWidget map={map} height='90%' width='100%'/>
</div>
```