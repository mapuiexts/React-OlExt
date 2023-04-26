import React from 'react';
import OlLayerBase from 'ol/layer/Base';
import {Form, Input, InputNumber, Checkbox} from 'antd';

const getOpts = (layer) => {
    if(layer instanceof OlLayerBase) {
        const sourceOpts = {
            source: {
                url: layer.getSource().getUrls(),
                attributions: layer.getSource().getAttributions() && layer.getSource().getAttributions()('ready'),
                params: {
                    FEATURE_COUNT: layer.getSource().getParams().FEATURE_COUNT,
                    FORMAT: layer.getSource().getParams().FORMAT,
                    LAYERS: layer.getSource().getParams().LAYERS,
                    STYLES: layer.getSource().getParams().STYLES,
                    VERSION: layer.getSource().getParams().VERSION,
                    CQL_FILTER: layer.getSource().getParams().CQL_FILTER
                }
            }
        };
        return sourceOpts;
    }
};

const TileWMSSourceTab = (
    {
        mode
    }) => {
    
    return(
        <React.Fragment>
            {/* URLS */}
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

            {/* Attributions */
                <Form.Item
                    name={['source', 'attributions']}
                    label="Attributions"
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
            }

            {/* Cache Size  */
                mode === "new" &&
                <Form.Item
                    name={['source', 'cacheSize']}
                    label="Cache Size"
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <InputNumber/>
                </Form.Item>
            }

            {/* Cross-Origin */
                mode === "new" &&
                <Form.Item
                    name={['source', 'crossOrigin']}
                    label="Cross Origin"
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
            }

            {/* Image Smoothing */
                mode === "new" &&
                <Form.Item
                    name={['source', 'imageSmoothing']}
                    label="Image Smooth.: "
                    valuePropName="checked"
                >
                    <Checkbox/>
                </Form.Item>
            }

            {/*FEATURE_COUNT Param*/}
            <Form.Item
                name={['source', 'params', 'FEATURE_COUNT']}
                label="Feature Count"
                // rules={[
                //     {
                //         required: true,
                //     },
                // ]}
            >
                <InputNumber/>
            </Form.Item>

            {/*FORMAT Param*/}
            <Form.Item
                name={['source', 'params', 'FORMAT']}
                label="Format"
                // rules={[
                //     {
                //         required: true,
                //     },
                // ]}
            >
                <Input/>
            </Form.Item>

            {/* LAYERS Param */}
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
            
            {/* STYLES Param */}
            <Form.Item
                name={['source', 'params', 'STYLES']}
                label="Styles"
            >
                <Input/>
            </Form.Item>
            
            {/* VERSION Param */}
            <Form.Item
                name={['source', 'params', 'VERSION']}
                label="Version"
                // rules={[
                //     {
                //         required: true,
                //     },
                // ]}
            >
                <Input/>
            </Form.Item>

            {/* CQL FILTER Param */}
            <Form.Item
                name={['source', 'params', 'CQL_FILTER']}
                label="CQL Filter"
            >
                <Input.TextArea allowClear/>
            </Form.Item>

             {/* Gutter */
                mode === "new" &&
                <Form.Item
                    name={['source', 'gutter']}
                    label="Gutter"
                >
                    <InputNumber/>
                </Form.Item>
            }

            {/* hidpi */
                mode === "new" &&
                <Form.Item
                    name={['source', 'hidpi']}
                    label="hidpi"
                    valuePropName="checked"
                >
                    <Checkbox/>
                </Form.Item>
            }

            {/* Maximum Zoom */
                mode === "new" &&
                <Form.Item
                    name={['source', 'maxZoom']}
                    label="Max Zoom"
                >
                    <InputNumber/>
                </Form.Item>
            }

            {/* Reprojection Error Threshold */
                mode === "new" &&
                <Form.Item
                    name={['source', 'reprojectionErrorThreshold']}
                    label="Reproj. Error Threshold"
                >
                    <InputNumber/>
                </Form.Item>
            }

            {/* Server Type */
                mode === "new" &&
                <Form.Item
                    name={['source', 'serverType']}
                    label="Server Type"
                >
                    <Input/>
                </Form.Item>
            }

            {/* Wrap X */
                mode === "new" &&
                <Form.Item
                    name={['source', 'wrapX']}
                    label="Wrap X"
                    valuePropName="checked"
                >
                    <Checkbox/>
                </Form.Item>
            }

            {/* Transition */
                mode === "new" &&
                <Form.Item
                    name={['source', 'transition']}
                    label="Transition"
                >
                    <InputNumber/>
                </Form.Item>
            }

        </React.Fragment>
    );
};

TileWMSSourceTab.getOpts = getOpts;

export default TileWMSSourceTab;