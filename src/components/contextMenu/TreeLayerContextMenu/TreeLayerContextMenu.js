import React  from 'react';
import {Menu} from 'antd';
import {FileAddOutlined  , EditOutlined  , DeleteOutlined , InfoCircleOutlined , ClearOutlined   } from '@ant-design/icons';
import OlLayerImage from 'ol/layer/Image';
import OlLayerGroup from 'ol/layer/Group';
import OlLayerVector from 'ol/layer/Vector';
import TreeContextMenu from '../TreeContextMenu/TreeContextMenu';
import NewImageWMSLayerButton from '../../button/layer/new/NewImageWMSLayerButton/NewImageWMSLayerButton';
import NewTileWMSLayerButton from '../../button/layer/new/NewTileWMSLayerButton/NewTileWMSLayerButton';
import NewGroupLayerButton from '../../button/layer/new/NewGroupLayerButton/NewGroupLayerButton';
import NewOSMLayerButton from '../../button/layer/new/NewOSMLayerButton/NewOSMLayerButton';
import EditLayerButton from '../../button/layer/edit/EditLayerButton/EditLayerButton';
import RemoveLayerButton from '../../button/layer/remove/RemoveLayerButton/RemoveLayerButton';
import ClearAllFeaturesButton from '../../button/feature/ClearAllFeaturesButton/ClearAllFeaturesButton';
import WmsGetFeatureInfoButton from '../../button/wms/WmsGetFeatureInfoButton/WmsGetFeatureInfoButton';

const TreeLayerContextMenu = ({
    map,
    node,
    xPos,
    yPos,
    showMenu

}) => {

   
    if(!node) return null;

    const createAddWMSLayerButtonItem = (layer, items) => {
        if(layer && layer instanceof OlLayerGroup) {
            items.push({
                key: "ADD_WMS_LAYER",
                label: <NewImageWMSLayerButton 
                        size="small"
                        type="text"
                        map={map} 
                        parentLayerGroup={layer}
                        wndStyle={{visibility: 'visible', width: 700, maxHeight: 500}}
                    >
                        New WMS Layer
                    </NewImageWMSLayerButton>
            });
        }
    };

    const createAddTileWMSLayerButtonItem = (layer, items) => {
        if(layer && layer instanceof OlLayerGroup) {
            items.push({
                key: "ADD_TILE_WMS_LAYER",
                label: <NewTileWMSLayerButton 
                            size="small"
                            type="text"
                            map={map} 
                            parentLayerGroup={layer}
                            wndStyle={{width: 700, maxHeight: 500}}
                        >
                            New Tile WMS Layer
                        </NewTileWMSLayerButton>
            });
        }
    };

    const createAddGroupLayerButtonItem = (layer, items) => {
        if(layer && layer instanceof OlLayerGroup) {
            items.push({
                key: "ADD_GROUP_LAYER",
                label: <NewGroupLayerButton 
                            size="small"
                            type="text"
                            map={map} 
                            parentLayerGroup={layer}
                            wndStyle={{width: 700, maxHeight: 500}}
                        >
                            New Group Layer
                        </NewGroupLayerButton>
            });
        }
    };

    const createAddOSMLayerButtonItem = (layer, items) => {
        if(layer && layer instanceof OlLayerGroup) {
            items.push({
                key: "ADD_OSM_LAYER",
                label: <NewOSMLayerButton 
                            size="small"
                            type="text"
                            map={map} 
                            parentLayerGroup={layer}
                            wndStyle={{width: 700, maxHeight: 500}}
                        >
                            New OSM Layer
                        </NewOSMLayerButton>
            });
        }
    };

    const createAddLayerItems = (layer, items) => {
        if(layer && layer instanceof OlLayerGroup) {
            const subItems = [];
            items.push({
                key: "ADD_LAYER",
                icon: <FileAddOutlined/>,
                label: "Add Layer",
                children: subItems
            });
            createAddGroupLayerButtonItem(layer, subItems);
            createAddWMSLayerButtonItem(layer, subItems);
            createAddTileWMSLayerButtonItem(layer, subItems);
            createAddOSMLayerButtonItem(layer, subItems);
        }
    };

    const createEditLayerButtonItem = (layer, items) => {
        if(layer) {
            items.push({
                key: "EDIT_LAYER",
                icon: <EditOutlined/>,
                label: <EditLayerButton 
                            size="small" 
                            type="text"
                            wndStyle={{width: 700, maxHeight: 500}}
                            layer={layer}
                        >
                            Edit Layer
                        </EditLayerButton>
            });
        }
    };

    const createRemoveLayerButtonItem = (layer, items) => {
        if(layer && layer !== map.getLayerGroup()) {
            items.push({
                key: "REMOVE_LAYER",
                icon: <DeleteOutlined />,
                label:  <RemoveLayerButton size='small' type="text" map={map} layer={node.ol_layer}>
                            Remove Layer
                        </RemoveLayerButton>
            });
        }
    };

    const createClearLayerButtonItem = (layer, items) => {
        if(layer instanceof OlLayerVector) {
            items.push({
                key: "CLEAR_LAYER",
                icon: <ClearOutlined  />,
                label: <ClearAllFeaturesButton size='small' type="text" map={map} vectorLayer={node.ol_layer}>
                            Clear Layer
                        </ClearAllFeaturesButton>
            });
        }
    };


    const createGetFeatureInfoButtonItem = (map, layer, items) => {
        if(layer instanceof OlLayerImage || layer instanceof OlLayerGroup) {
            items.push({
                key: "GET_FEATURE_INFO",
                icon: <InfoCircleOutlined />,
                label:  <WmsGetFeatureInfoButton 
                            size='small' 
                            type="text"
                            map={map}
                            layers={[layer]}
                            wndStyle={{width:600}}
                        >
                            Feature Info
                        </WmsGetFeatureInfoButton>
            });
        }
    };

    const items = [];
    createAddLayerItems(node.ol_layer, items);
    createEditLayerButtonItem(node.ol_layer, items);
    createRemoveLayerButtonItem(node.ol_layer, items);
    createClearLayerButtonItem(node.ol_layer, items);
    createGetFeatureInfoButtonItem(map, node.ol_layer, items);

    const menuOverlay = (
        <Menu mode="vertical" items={items}/>
    );


    return(
            <TreeContextMenu 
                overlay={menuOverlay}
                node = {node}
                xPos={xPos}
                yPos={yPos}
                showMenu={showMenu}
            />
    );
};

export default TreeLayerContextMenu;