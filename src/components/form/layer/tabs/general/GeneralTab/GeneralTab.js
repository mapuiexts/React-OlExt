import React from 'react';
import BaseLayer from 'ol/layer/Base';
import {Form, Slider, Checkbox, InputNumber, Input} from 'antd';

const getOpts = (layer) => {
    if (layer instanceof BaseLayer) {
        const layerOpts = {
            name: layer ? layer.get('name') : undefined,
            maxResolution: layer ? layer.getMaxResolution() : undefined,
            minResolution: layer ? layer.getMinResolution() : undefined,
            maxZoom: layer ? layer.getMaxZoom() : undefined,
            minZoom: layer ? layer.getMinZoom() : undefined,
            opacity: layer ? layer.getOpacity() : 1,
            visible: layer ? layer.getVisible() : true,
            zIndex: layer ? layer.getZIndex() : 0
        };
        return layerOpts;
    }
    else {
        const {source, ...layerOpts} = layer;
        return layerOpts;
    }
};

/**
 * The 'General' Tab for the Base Layer to be used in the Layer Form
 */
const GeneralTab = () => {
    return(
        <React.Fragment>
            <Form.Item
                name="name"
                label="Name"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                    name="maxResolution"
                    label="Max Resolution"
                >
                    <InputNumber/>
            </Form.Item>
            <Form.Item
                name="minResolution"
                label="Min Resolution"
            >
                <InputNumber/>
            </Form.Item>
            <Form.Item
                name="maxZoom"
                label="Max Zoom"
            >
                <InputNumber/>
            </Form.Item>
            <Form.Item
                name="minZoom"
                label="Min Zoom"
            >
                <InputNumber/>
            </Form.Item>
            <Form.Item
                name="opacity"
                label="Opacity"
            >
                <Slider max={1} step={0.1}/>
            </Form.Item>
            <Form.Item
                name="visible"
                valuePropName="checked"
                label="Visible"
            >
                <Checkbox/>
            </Form.Item>
            <Form.Item
                name="zIndex"
                label="Z-Index"
            >
                <InputNumber/>
            </Form.Item>
        </React.Fragment>
    );
};

GeneralTab.getOpts = getOpts;

export default GeneralTab;