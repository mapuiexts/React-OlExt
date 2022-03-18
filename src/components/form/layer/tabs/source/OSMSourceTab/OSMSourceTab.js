import React from 'react';
import OlLayerBase from 'ol/layer/Base';
import OlState from 'ol/source/State';
import {Form, Input, InputNumber, Checkbox} from 'antd';

const getOpts = (layer) => {
    if(layer instanceof OlLayerBase) {
        const sourceOpts = {
            source: {
                url: layer.getSource().getUrls(),
                attributions: layer.getSource().getAttributions()(OlState.READY)
            }
        };
        return sourceOpts;
    }
};

const OSMSourceTab = (
    {
        mode
    }) => {
    
    return(
        <React.Fragment>
            {/* URL */}
            <Form.Item
                name={['source', 'url']}
                label="URL"
                rules={[
                    {
                        required: false,
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

            {/* Maximum Zoom */
                mode === "new" &&
                <Form.Item
                    name={['source', 'maxZoom']}
                    label="Max Zoom"
                >
                    <InputNumber/>
                </Form.Item>
            }

            {/* Opaque */
                mode === "new" &&
                <Form.Item
                    name={['source', 'opaque']}
                    label="Opaque"
                    valuePropName="checked"
                >
                    <Checkbox/>
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

            {/* Transition */
                mode === "new" &&
                <Form.Item
                    name={['source', 'transition']}
                    label="Max Zoom"
                >
                    <InputNumber/>
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

        </React.Fragment>
    );
};

OSMSourceTab.getOpts = getOpts;

export default OSMSourceTab;