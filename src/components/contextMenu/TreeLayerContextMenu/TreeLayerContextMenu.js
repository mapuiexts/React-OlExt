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

    const createAddWMSLayerButton = (layer) => {
        if(layer && layer instanceof OlLayerGroup) {
            return(
                <Menu.Item key="ADD_WMS_LAYER" icon={<FileAddOutlined   />}>
                    <NewImageWMSLayerButton 
                        size="small"
                        type="text"
                        map={map} 
                        parentLayerGroup={layer}
                        wndStyle={{visibility: 'visible', width: 700, maxHeight: 500}}
                    >
                        New WMS Layer
                    </NewImageWMSLayerButton>
                </Menu.Item>
            );
        }
        return null;
    }

    const createAddTileWMSLayerButton = (layer) => {
        if(layer && layer instanceof OlLayerGroup) {
            return(
                <Menu.Item key="ADD_TILE_WMS_LAYER" icon={<FileAddOutlined   />}>
                    <NewTileWMSLayerButton 
                        size="small"
                        type="text"
                        map={map} 
                        parentLayerGroup={layer}
                        wndStyle={{visibility: 'visible', width: 700, maxHeight: 500}}
                    >
                        New Tile WMS Layer
                    </NewTileWMSLayerButton>
                </Menu.Item>
            );
        }
        return null;
    }

    // const createAddWMSLayerButton = (layer) => {
    //     if(layer && layer instanceof OlLayerGroup) {
    //         return(
    //             <Menu.Item icon={<FileAddOutlined   />}>
    //                 <AddImageWMSLayerButton 
    //                     size="small"
    //                     type="text"
    //                     map={map} 
    //                     layerGroup={layer}
    //                     wndStyle={{visibility: 'visible', width: 700, maxHeight: 500}}
    //                 >
    //                     Add WMS Layer
    //                 </AddImageWMSLayerButton>
    //             </Menu.Item>
    //         );
    //     }
    //     return null;
    // }

    const createAddGroupLayerButton = (layer) => {
        if(layer && layer instanceof OlLayerGroup) {
            return(
                <Menu.Item key="ADD_GROUP_LAYER" icon={<FileAddOutlined   />}>
                    <NewGroupLayerButton 
                        size="small"
                        type="text"
                        map={map} 
                        parentLayerGroup={layer}
                        wndStyle={{visibility: 'visible', width: 700, maxHeight: 500}}
                    >
                        New Group Layer
                    </NewGroupLayerButton>
                </Menu.Item>
            );
        }
        return null;
    }

    const createAddOSMLayerButton = (layer) => {
        if(layer && layer instanceof OlLayerGroup) {
            return(
                <Menu.Item key="ADD_OSM_LAYER" icon={<FileAddOutlined   />}>
                    <NewOSMLayerButton 
                        size="small"
                        type="text"
                        map={map} 
                        parentLayerGroup={layer}
                        wndStyle={{visibility: 'visible', width: 700, maxHeight: 500}}
                    >
                        New OSM Layer
                    </NewOSMLayerButton>
                </Menu.Item>
            );
        }
        return null;
    }

    // const createAddGroupLayerButton = (layer) => {
    //     if(layer && layer instanceof OlLayerGroup) {
    //         return(
    //             <Menu.Item icon={<FileAddOutlined   />}>
    //                 <AddGroupLayerButton 
    //                     size="small"
    //                     type="text"
    //                     map={map} 
    //                     layerGroup={layer}
    //                     wndStyle={{visibility: 'visible', width: 700, maxHeight: 500}}
    //                 >
    //                     Add Group Layer
    //                 </AddGroupLayerButton>
    //             </Menu.Item>
    //         );
    //     }
    //     return null;
    // }

    /*
    const createAddLayerSubMenu = (layer) => {
        if(layer && layer instanceof OlLayerGroup) {
            return(
                <Menu.SubMenu title="Add Layer" icon={<FileAddOutlined   />}>
                    {createAddWMSLayerButton(layer)}
                    {createAddGroupLayerButton(layer)}
                </Menu.SubMenu>
            );
        }
        return null;
    }
    */

    
    // const createAddLayerItemGroup = (layer) => {
    //     if(layer && layer instanceof OlLayerGroup) {
    //         return(
    //             <Menu.ItemGroup title="Add Layer">
    //                 {/* <FileAddTwoTone/> */}
    //                 {createAddWMSLayerButton(layer)}
    //                 {createAddGroupLayerButton(layer)}
    //             </Menu.ItemGroup>
    //         );
    //     }
    //     return null;
    // }
    

    const createEditLayerButton = (layer) => {
        if(layer) {
            return (
                <Menu.Item key="EDIT_LAYER" icon={<EditOutlined />}>
                    <EditLayerButton 
                        size="small" 
                        type="text"
                        wndStyle={{visibility: 'visible', width: 700, maxHeight: 500}}
                        layer={layer}
                    >
                        Edit Layer
                    </EditLayerButton>
                </Menu.Item>
            );
        }
    }

    const createRemoveLayerButton = (layer) => {
        if(layer && layer !== map.getLayerGroup()) {
            return(
                <Menu.Item key="REMOVE_LAYER" icon={<DeleteOutlined />}>
                    <RemoveLayerButton size='small' type="text" map={map} layer={node.ol_layer}>
                        Remove Layer
                    </RemoveLayerButton>
                </Menu.Item>
            );
        }
        return null;
    }

    const createClearLayerButton = (layer) => {
        if(layer instanceof OlLayerVector) {
            return (
                <Menu.Item key="CLEAR_LAYER" icon={<ClearOutlined  />}>
                    <ClearAllFeaturesButton size='small' type="text" map={map} vectorLayer={node.ol_layer}>
                        Clear Layer
                    </ClearAllFeaturesButton>
                </Menu.Item>
            );
        }
        return null;
    };

    const createGetFeatureInfoButton = (map, layer) => {
        if(layer instanceof OlLayerImage || layer instanceof OlLayerGroup) {
            return (
                <Menu.Item key="GET_FEATURE_INFO" icon={<InfoCircleOutlined />} selectable={false}>
                    <WmsGetFeatureInfoButton 
                        size='small' 
                        type="text"
                        map={map}
                        layers={[layer]}
                        wndStyle={{visibility: 'visible', width:600}}
                    >
                        Feature Info
                    </WmsGetFeatureInfoButton>
                 </Menu.Item>
            );
        }
        return null;
    };

    let overlay = (
        <Menu mode="vertical">
            {createEditLayerButton(node.ol_layer)}
            {createRemoveLayerButton(node.ol_layer)}
            {createClearLayerButton(node.ol_layer)}
            {createGetFeatureInfoButton(map, node.ol_layer)}
            <Menu.Divider/>
            <Menu.Divider/>
            {createAddGroupLayerButton(node.ol_layer)}
            {createAddWMSLayerButton(node.ol_layer)}
            {createAddTileWMSLayerButton(node.ol_layer)}
            {createAddOSMLayerButton(node.ol_layer)}
            {/* {createAddLayerSubMenu(node.ol_layer)} */}
            {/* {createAddLayerItemGroup(node.ol_layer)} */}
        </Menu>
    );

   
    // overlay = (
    //     <React.Fragment>
    //         {createEditLayerButton(node.ol_layer)}
    //         {createRemoveLayerButton(node)}
    //         {createClearLayerButton(node.ol_layer)}
    //         {createGetFeatureInfoButton(map, node.ol_layer)}
    //         {createAddWMSLayerButton(node.ol_layer)}
    //         {createAddGroupLayerButton(node.ol_layer)}
    //     </React.Fragment>
    // );

    // overlay = (
    //     <Menu mode="vertical">
    //         <Menu.Item>
    //             {createEditLayerButton(node.ol_layer)}
    //         </Menu.Item>
    //         <Menu.Item>
    //             {createRemoveLayerButton(node)} 
    //         </Menu.Item>
    //         <Menu.Item>
    //             {createClearLayerButton(node.ol_layer)}
    //         </Menu.Item>
    //         <Menu.Item>
    //             {createGetFeatureInfoButton(map, node.ol_layer)}    
    //         </Menu.Item>
    //         <Menu.Divider/>
    //         <Menu.SubMenu title="Add Layer">
    //             <Menu.Item>
    //                 {createAddWMSLayerButton(node.ol_layer)}
    //             </Menu.Item>
    //             <Menu.Item>
    //                 {createAddGroupLayerButton(node.ol_layer)}
    //             </Menu.Item>
    //         </Menu.SubMenu>
    //     </Menu>
    // );

    return(
            <TreeContextMenu 
                overlay={overlay}
                node = {node}
                xPos={xPos}
                yPos={yPos}
                showMenu={showMenu}
            />
    );
};

export default TreeLayerContextMenu;