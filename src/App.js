import React from 'react';
import {
  SimpleHeader, 
  MapWidget,
  MapOverviewWidget,
  BorderLayout,
  LayerTree,
  WmsGetFeatureInfoButton,
  GetCoordinateButton,
  WfsFeatureGrid,
  ZoomCenterButton,
  AboutButton,
  NewImageWMSLayerButton,
  NewGroupLayerButton
} from './main.js';
import {createDefaultOverviewMap} from './util/map';
import {createDefaultMap} from './util/map';
import OlSourceVector from 'ol/source/Vector';
import OlLayerVector from 'ol/layer/Vector';
import ImageLayer from 'ol/layer/Image';
import ImageWMSSource from 'ol/source/ImageWMS';
import LayerGroup from 'ol/layer/Group';
import {Space, Menu} from 'antd';
import {InfoOutlined } from '@ant-design/icons';
import {get as getProjection} from 'ol/proj';
//import './App.css';
import 'antd/dist/antd.min.css'; //https://github.com/ant-design/ant-design/issues/33327
//import 'antd/dist/antd.css';
//import 'ol/ol.css';
import './assets/css/react-olext-ol.css';



//Init Vector Layer to render wfs queries
const createWfsLayer = (map) => {
  const layer = new OlLayerVector({
    name: 'WFS Flemish Addresses',
    source: new OlSourceVector()
  });
  map.addLayer(layer);
  return layer;
};

//wfs options to be used by WFS GetFeature query
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

//create wms layers
const createWmsLayers = (map) => {
  //create parcel wms layer
  const wmsParcelLayer = new ImageLayer({
    name: 'GRB Parcels',
    visible: false,
    source: new ImageWMSSource({
      url: 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/Adpf/wms',
      params: {
        STYLES: '',
        LAYERS: 'Adpf',
        INFO_FORMAT: 'application/vnd.esri.wms_featureinfo_xml'
      }
    })
  });
  //create building wms layer
  const wmsbuildingLayer = new ImageLayer({
    name: 'GRB Realized Buildings',
    source: new ImageWMSSource({
      url: 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/Gebouwenregister/wms',
      params: {
        STYLES: '',
        LAYERS: 'G_GEREALISEERD',
        INFO_FORMAT: 'application/vnd.esri.wms_featureinfo_xml'
      }
    })
  });
  //create address wms layer
  const wmsaddressLayer = new ImageLayer({
    name: 'GRB Addresses',
    visible: false,
    source: new ImageWMSSource({
      url: 'https://geoservices.informatievlaanderen.be/raadpleegdiensten/Adressen/wms',
      params: {
        STYLES: '',
        LAYERS: 'Adrespos',
        INFO_FORMAT: 'application/vnd.esri.wms_featureinfo_xml'
      }
    })
  });
  //create group layers
  const wmsGroupLayer = new LayerGroup({
    name: 'WMS Flemish Layers',
    layers: [wmsParcelLayer, wmsbuildingLayer, wmsaddressLayer],
  });
  //add layers to map
  map.addLayer(wmsGroupLayer);
  
  return wmsGroupLayer;

};

//handler to resize the overview map if the border is resized
const dragHandler = () => {
  map.updateSize();
  overviewMap.updateSize();
  overviewMap.getView().setCenter(map.getView().getCenter());
  overviewMap.getView().set('resolution', magnification * map.getView().getResolution());
};


//initialize map
const url = 'https://geoservices.informatievlaanderen.be/overdrachtdiensten/Adressen/wfs';
const viewOpts= {
  projection: 'EPSG:31370',
  center: [157257, 172012],
  zoom: 18
};
const map = createDefaultMap(viewOpts);
const wmsLayers = createWmsLayers(map);
const wfsLayer = createWfsLayer(map);
const wfsOptions = getWfsOptions();


//create overview map
const overviewMap = createDefaultOverviewMap(map);
//projections to be used in the application
const projs= [map.getView().getProjection(), getProjection('EPSG:4326')];
const magnification = 5;

const App = () => {
  return (
    // <MapProvider map={map}>
    <BorderLayout split="horizontal" minSize={0} maxSize={150} defaultSize={150} onDragFinished={dragHandler} >
      <Space direction='vertical' style={{width:"100%", minWidth:'100%', maxWidth:'100%'}}>
        <SimpleHeader map={map}/>   
        <Menu mode="horizontal">
          <Menu.Item key="1"><GetCoordinateButton type="primary" map={map} projs={[map.getView().getProjection(), getProjection('EPSG:4326')]}>Get Coordinate</GetCoordinateButton></Menu.Item>
          <Menu.Item key="2"><ZoomCenterButton type="primary" map={map} projs={projs}>Zoom Center</ZoomCenterButton></Menu.Item>
          <Menu.Item key="3"><NewImageWMSLayerButton type="primary" map={map} wndStyle={{visibility: 'visible', width: 700, maxHeight: 500}}>New WMS Layer</NewImageWMSLayerButton></Menu.Item>
          <Menu.Item key="4"><NewGroupLayerButton type="primary" map={map} wndStyle={{visibility: 'visible', width: 700, maxHeight: 500}}>New Group Layer</NewGroupLayerButton></Menu.Item>
          <Menu.Item key="5"><AboutButton type="primary"/></Menu.Item>
          <Menu.Item key="7"><WmsGetFeatureInfoButton icon= {<InfoOutlined style={{fontSize:20}}/>}  shape="circle" type='primary' style={{backgroundColor:'red'}} map={map} layers={wmsLayers.getLayers().getArray()} wndStyle={{width:600}}/></Menu.Item>
        </Menu>
      </Space>
      <BorderLayout split="horizontal" defaultSize={250} primary="second" onDragFinished={dragHandler}>
        <BorderLayout split="vertical" defaultSize={250} onDragFinished={dragHandler}>
          {/* <VBoxLayout> */}
            <div style={{width:"100%"}}>
              <LayerTree map={map}/>
            </div>
          {/* </VBoxLayout> */}
          <BorderLayout split="vertical" primary="second" defaultSize={350} maxSize={400} minSize={0} onDragFinished={dragHandler}>
              <MapWidget map={map}/>
              <MapOverviewWidget parentMap={map} map={overviewMap} magnification={magnification}/>
          </BorderLayout>
        </BorderLayout>
        <WfsFeatureGrid url={url} wfsOptions={wfsOptions} map={map} vectorLayer={wfsLayer}/>
      </BorderLayout>
    </BorderLayout>
    // </MapProvider>
  );
};

export default App;





