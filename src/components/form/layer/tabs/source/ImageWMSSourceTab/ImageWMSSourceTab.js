import React from 'react';
import OlLayerBase from 'ol/layer/Base';
import {Form, Input, InputNumber} from 'antd';

const getOpts = (layer) => {
    if(layer instanceof OlLayerBase) {
        const sourceOpts = {
            source: {
                url: layer.getSource().getUrl(), 
                params: {
                    FEATURE_COUNT: layer.getSource().getParams().FEATURE_COUNT,
                    FORMAT: layer.getSource().getParams().FORMAT,
                    LAYERS: layer.getSource().getParams().LAYERS,
                    STYLES: layer.getSource().getParams().STYLES,
                    VERSION: layer.getSource().getParams().VERSION,
                    CQL_FILTER: layer.getSource().getParams().CQL_FILTER,
                    INFO_FORMAT: layer.getSource().getParams().INFO_FORMAT
                },
            }
        };
        return sourceOpts;
    }
};

const ImageWMSSourceTab = (props) => {
    return(
        <React.Fragment>
            <Form.Item
                name={['source', 'url']}
                label="URL"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                name={['source', 'params', 'FEATURE_COUNT']}
                label="Feature Count"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <InputNumber/>
            </Form.Item>

            <Form.Item
                name={['source', 'params', 'FORMAT']}
                label="Format"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                name={['source', 'params', 'LAYERS']}
                label="Layers"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                name={['source', 'params', 'STYLES']}
                label="Styles"
            >
                <Input/>
            </Form.Item>

            <Form.Item
                name={['source', 'params', 'VERSION']}
                label="Version"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                name={['source', 'params', 'CQL_FILTER']}
                label="CQL Filter"
                
            >
                <Input.TextArea allowClear/>
            </Form.Item>

            <Form.Item
                name={['source', 'params', 'INFO_FORMAT']}
                label="FeatureInfo Format"
            >
                <Input/>
            </Form.Item>
        </React.Fragment>
    );
};

ImageWMSSourceTab.getOpts = getOpts;

export default ImageWMSSourceTab;