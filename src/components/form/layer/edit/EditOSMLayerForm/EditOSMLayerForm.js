import {useCallback} from 'react';
import OlOSMSource from 'ol/source/OSM';
import EditLayerForm from '../EditLayerForm/EditLayerForm';
import GeneralTab from '../../tabs/general/GeneralTab/GeneralTab';
import OSMSourceTab  from '../../tabs/source/OSMSourceTab/OSMSourceTab';

const EditOSMLayerForm = ({
    layer, 
    onFinish
}) => {

    const onInternalFinish = useCallback((values) => {
        const {source, ...properties} = values;
        layer.setProperties(properties);
        if(source) {
            if(layer.getSource() instanceof OlOSMSource) {
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
                    el: OSMSourceTab
                }
            ]}
        />
    );
};

export default EditOSMLayerForm;
