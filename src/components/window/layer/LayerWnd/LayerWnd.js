import React from 'react';
import ImageWMSSource from 'ol/source/ImageWMS';
import TileWMSSource from 'ol/source/TileWMS';
import OSMSource from 'ol/source/OSM';
import OlLayerGroup from 'ol/layer/Group';
import Window from '../../base/Window/Window';
import EditDefaultLayerForm from '../../../form/layer/edit/EditDefaultLayerForm/EditDefaultLayerForm';
import EditWMSLayerForm from '../../../form/layer/edit/EditImageWMSLayerForm/EditImageWMSLayerForm';
import EditTileWMSLayerForm from '../../../form/layer/edit/EditTileWMSLayerForm/EditTileWMSLayerForm';
import EditOSMLayerForm from '../../../form/layer/edit/EditOSMLayerForm/EditOSMLayerForm';

const LayerWnd = ({
    title="Layer",
    visible=false,
    onOk,
    layer,
    ...otherProps
}) => {

    const createLayerForm = () => {
        if(layer instanceof OlLayerGroup) {
            return(
                <EditDefaultLayerForm 
                    layer={layer} 
                    onFinish={onOk}
                />
            );
        }
        else if(layer.getSource() instanceof ImageWMSSource) {
            return (
                <EditWMSLayerForm 
                    layer={layer} 
                    onFinish={onOk}
                />
            );
        }
        else if(layer.getSource() instanceof TileWMSSource) {
            return (
                <EditTileWMSLayerForm 
                    layer={layer} 
                    onFinish={onOk}
                />
            );
        }
        else if(layer.getSource() instanceof OSMSource) {
            return (
                <EditOSMLayerForm 
                    layer={layer} 
                    onFinish={onOk}
                />
            );
        }
        
        return (
            <EditDefaultLayerForm 
                layer={layer} 
                onFinish={onOk}
            />
        )
    };

    return (
        <Window
            title={title}
            collapsible
            //onOk={onOk}
            visible={visible}
            {...otherProps}
        >
            {createLayerForm()}
      </Window>
    );
};

export default LayerWnd;