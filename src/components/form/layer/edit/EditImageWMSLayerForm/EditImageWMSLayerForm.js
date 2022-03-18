import {useCallback} from 'react';
import OlImageWMSSource from 'ol/source/ImageWMS';
import EditLayerForm from '../EditLayerForm/EditLayerForm.js';
import GeneralTab from '../../tabs/general/GeneralTab/GeneralTab';
import ImageWMSSourceTab from '../../tabs/source/ImageWMSSourceTab/ImageWMSSourceTab';
import {normalizeStringInObject} from '../../../../../util/common';

const EditImageWMSLayerForm = ({
    layer, 
    onFinish
}) => {

    const onInternalFinish = useCallback((values) => {
        normalizeStringInObject(values);
        if(values.source) {
            normalizeStringInObject(values.source);
            if(values.source.params)
                normalizeStringInObject(values.source.params);
        }
        const {source, ...properties} = values;
        layer.setProperties(properties);
        if(source) {
            if(layer.getSource() instanceof OlImageWMSSource) {
                layer.getSource().setUrl(source.url);
                for(let key in source.params) {
                    if(source.params[key] === "") {
                        source.params[key] = undefined;
                    }
                }
                layer.getSource().updateParams(source.params);
            }
        }
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
