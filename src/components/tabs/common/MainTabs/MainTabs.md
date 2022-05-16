On the example below you can check how the <code>Main Tabs</code> Component works:</p>
<ul>
    <li>
        This component will allow the application to add/remove tabs dynamically.
    </li>
    <li> 
        The MainTabsProvider will allow to have access to the array of tabs.
    </li> 
    <li>
        The UseMainTabs hook will make easy to get and update the array of tabs.
    </li>
    <li>
        In the example below, a custom checkbox was defined to add/remove 
        the WFS Street Grid tab dynamically.
    </li>
</ul>


```js
import {useState} from 'react';
import {Checkbox, Tabs} from 'antd';
import {createDefaultMap} from '../../../../util/map';
import MapWidget from '../../../widget/map/MapWidget/MapWidget';
import MainTabsProvider from '../../../../provider/MainTabsProvider';
import useMainTabs from '../../../../hooks/ui/useMainTabs';
import MainTabs from '../../../tabs/common/MainTabs/MainTabs';
import WfsFeatureGrid from '../../../grid/feature/WfsFeatureGrid/WfsFeatureGrid';
import OlSourceVector from 'ol/source/Vector';
import OlLayerVector from 'ol/layer/Vector';


const addVectorLayer = (map) => {
  const layer = new OlLayerVector({
    name: 'WFS Flemish Addresses',
    source: new OlSourceVector()
  });
  map.addLayer(layer);
  return layer;
};

const getWfsOptions = () => {
    const wfsOptions = {
        srsName: 'EPSG:31370',
        featureNS: 'informatievlaanderen.be/Adressen',
        featurePrefix: 'Adressen',
        featureTypes: ['Adrespos'],
        geometryName: 'adrespositie',
        outputFormat: 'application/json',
        maxFeatures: 200
    };
    return wfsOptions;
};

//initialize variables
const url = 'https://geoservices.informatievlaanderen.be/overdrachtdiensten/Adressen/wfs';
const viewOpts= {
    projection: 'EPSG:31370',
    center: [157257, 172012],
    zoom: 18
};
const map = createDefaultMap(viewOpts);
const wfsLayer = addVectorLayer(map);
const wfsOptions = getWfsOptions();
const wfsGridTab = {
    key: 'wfs-street-grid-tab',
    name: 'Street',
    tab: <WfsFeatureGrid 
            url={url} 
            wfsOptions={wfsOptions} 
            map={map} 
            vectorLayer={wfsLayer}
            />
};
const emptyGridTab = {
    key: 'wfs-empty-tab',
    name: 'Empty Tab',
    tab: (
        <div>
            <p>Empty content for this Tab</p>
            <p>Feel free to add something!!!!</p>
        </div>
    )    
};
const myTabs = [
    wfsGridTab,
    emptyGridTab
];

//custom checkbox to add/remove tab
const AddTabCheckBoxExample = () => {
    const {tabs, setTabs} = useMainTabs();

    const onChangeHandler = (evt) => {
        if(evt.target.checked) {
            const newTabs = tabs.concat(wfsGridTab);
            setTabs(newTabs);
        }
        else {
            const newTabs = tabs.filter(item => item.key !== 'wfs-street-grid-tab');
            setTabs(newTabs);
        }
    };

    return(
        <Checkbox defaultChecked={true} onChange={onChangeHandler}>Add or Remove Wfs Grid Tab</Checkbox>
    );
};

//example application
const MainTabsExample = () => {
    const [tabs, setTabs] = useState(myTabs);
    return(
        <MainTabsProvider value={{tabs, setTabs}}>
            <div style={{display:'flex', height:'700px', width: '100%', flexDirection: 'column', gap:5}}>
                <div style={{height:'5%'}}><AddTabCheckBoxExample/></div>
                <MapWidget map={map} height='55%' width='100%'/>
                <div style={{height:'40%'}}>
                    <MainTabs size="small" type="card" tabPosition="top" defaultActiveKey='wfs-street-grid-tab' tabs={tabs}/>
                </div>
            </div>
        </MainTabsProvider>
    );
}

<MainTabsExample/>
```