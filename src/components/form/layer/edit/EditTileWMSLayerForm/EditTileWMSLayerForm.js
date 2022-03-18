import {useCallback} from 'react';
import OlTileWMSSource from 'ol/source/TileWMS';
import EditLayerForm from '../EditLayerForm/EditLayerForm';
import GeneralTab from '../../tabs/general/GeneralTab/GeneralTab';
import TileWMSourceTab  from '../../tabs/source/TileWMSSourceTab/TileWMSSourceTab';
import {normalizeStringInObject} from '../../../../../util/common';

const EditTileWMSLayerForm = ({
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
            if(layer.getSource() instanceof OlTileWMSSource) {
                //set urls
                if(source.url && Array.isArray(source.url)) {
                    layer.getSource().setUrls( source.url);
                }
                else if(source.url && (typeof source.url === 'string' || source.url instanceof String)) {
                    layer.getSource().setUrls(source.url.split(','));
                }
                //set attributions
                if(source.attributions &&  Array.isArray(source.attributions)) {
                    layer.getSource().setAttributions(source.attributions);
                }
                else if(source.attributions && (typeof source.attributions === 'string' 
                    || source.attributions instanceof String)) {
                    layer.getSource().setAttributions(source.attributions.split(','));
                }
                //set params
                if(source.params) layer.getSource().updateParams(source.params);
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
                    el: TileWMSourceTab
                }
            ]}
        />
    );
};

export default EditTileWMSLayerForm;
