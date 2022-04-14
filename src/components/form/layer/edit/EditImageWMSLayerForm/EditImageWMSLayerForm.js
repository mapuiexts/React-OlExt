import {useCallback} from 'react';
import OlImageWMSSource from 'ol/source/ImageWMS';
import EditLayerForm from '../EditLayerForm/EditLayerForm.js';
import GeneralTab from '../../tabs/general/GeneralTab/GeneralTab';
import ImageWMSSourceTab from '../../tabs/source/ImageWMSSourceTab/ImageWMSSourceTab';
import {resetObject} from '../../../../../util/common';
import defined from '../../../../../core/defined';
import {DEFAULT_WMS_IMAGE_FORMAT} from '../../../../../core/constants';
import {DEFAULT_WMS_VERSION } from 'ol/source/common';

const EditImageWMSLayerForm = ({
    layer, 
    onFinish
}) => {

    const onInternalFinish = useCallback((values) => {
        values = resetObject(values);
        if(defined(values)) {
            const {source, ...properties} = values; 
            layer.setProperties(properties);
            if(defined(source)) {
                if(defined(layer.getSource) && layer.getSource() instanceof OlImageWMSSource) {
                    layer.getSource().setUrl(source.url);
                    if(defined(source.params)) {
                        if(!defined(source.params.STYLES)) {
                            source.params.STYLES = '';
                        }
                        if(!defined(source.params.VERSION)) {
                            source.params.VERSION = DEFAULT_WMS_VERSION;
                        }
                        if(!defined(source.params.FORMAT)) {
                            source.params.FORMAT = DEFAULT_WMS_IMAGE_FORMAT;
                        }
                        if(!defined(source.params.FEATURE_COUNT)) {
                            delete source.params.FEATURE_COUNT;
                        }
                        layer.getSource().updateParams(source.params);
                    }
                }
            }
        }

        // normalizeStringInObject(values);
        // if(values.source) {
        //     normalizeStringInObject(values.source);
        //     if(values.source.params)
        //         normalizeStringInObject(values.source.params);
        // }
        // const {source, ...properties} = values;
        // layer.setProperties(properties);
        // if(source) {
        //     if(layer.getSource() instanceof OlImageWMSSource) {
        //         layer.getSource().setUrl(source.url);
        //         for(let key in source.params) {
        //             if(source.params[key] === "") {
        //                 source.params[key] = undefined;
        //             }
        //         }
        //         layer.getSource().updateParams(source.params);
        //     }
        // }
        
        //execute onFinish
        onFinish && onFinish(values);
        

    },[layer, onFinish]);

    return(
        <EditLayerForm 
            layer={layer} 
            onFinish={onInternalFinish}
            tabs = {[
                {
                    title: "General",
                    key: "general",
                    isDefault: true,
                    el: GeneralTab
                },
                {
                    title: "Source",
                    key: "source",
                    el: ImageWMSSourceTab
                }
            ]}
        />
    );
};

export default EditImageWMSLayerForm;
