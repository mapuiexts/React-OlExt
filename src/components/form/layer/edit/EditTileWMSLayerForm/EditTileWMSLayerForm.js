import {useCallback} from 'react';
import OlTileWMSSource from 'ol/source/TileWMS';
import EditLayerForm from '../EditLayerForm/EditLayerForm';
import GeneralTab from '../../tabs/general/GeneralTab/GeneralTab';
import TileWMSourceTab  from '../../tabs/source/TileWMSSourceTab/TileWMSSourceTab';
import {resetObject, isString} from '../../../../../util/common';
import defined from '../../../../../core/defined';
import {DEFAULT_WMS_IMAGE_FORMAT} from '../../../../../core/constants';
import {DEFAULT_WMS_VERSION } from 'ol/source/common';

const EditTileWMSLayerForm = ({
    layer, 
    onFinish
}) => {

    const onInternalFinish = useCallback((values) => {
        values = resetObject(values);
        if(defined(values)) {
            const {source, ...properties} = values;
            layer.setProperties(properties);
            if(defined(source)) {
                if(defined(layer.getSource) && layer.getSource() instanceof OlTileWMSSource) {
                    //set urls
                    if(source.url && Array.isArray(source.url)) {
                        layer.getSource().setUrls( source.url);
                    }
                    else if(source.url && isString(source.url)) {
                        layer.getSource().setUrls(source.url.split(','));
                    }
                    //set attributions
                    if(source.attributions &&  Array.isArray(source.attributions)) {
                        layer.getSource().setAttributions(source.attributions);
                    }
                    else if(source.attributions && isString(source.attributions)) {
                        layer.getSource().setAttributions(source.attributions.split(','));
                    }
                    //set params
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
                        // if(!defined(source.params.FEATURE_COUNT)) {
                        //     source.params.FEATURE_COUNT = undefined;
                        // }
                        layer.getSource().updateParams(source.params);
                    }
                }
            }
            //execute onFinish
            onFinish && onFinish(values);
        }
        

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
                    el: TileWMSourceTab
                }
            ]}
        />
    );
};

export default EditTileWMSLayerForm;
