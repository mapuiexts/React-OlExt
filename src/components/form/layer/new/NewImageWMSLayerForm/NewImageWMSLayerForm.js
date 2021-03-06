import {useCallback} from 'react';
import OlImageLayer from 'ol/layer/Image';
import OlImageWMSSource from 'ol/source/ImageWMS';
import NewLayerForm from '../NewLayerForm/NewLayerForm';
import GeneralTab from '../../tabs/general/GeneralTab/GeneralTab';
import ImageWMSSourceTab  from '../../tabs/source/ImageWMSSourceTab/ImageWMSSourceTab';
import {DEFAULT_WMS_IMAGE_FORMAT} from '../../../../../core/constants';
import {DEFAULT_WMS_VERSION } from 'ol/source/common';

const defaultWMSLayerOpts = {
    opacity: 1,
    maxResolution: Infinity,
    maxZoom: Infinity,
    minResolution: 0,
    minZoom: -Infinity,
    visible: true,
    zIndex: 0,
    name: 'unnamed layer',
    source: {
        ratio: 1,
        params: {
            FORMAT: DEFAULT_WMS_IMAGE_FORMAT,
            STYLES: '',
            VERSION: DEFAULT_WMS_VERSION,
        }
    }
};

const NewImageWMSLayerForm = ({
    map,
    parentLayerGroup = undefined,
    layerOpts = defaultWMSLayerOpts, 
    onFinish = undefined
}) => {

    const onInternalFinish = useCallback((values) => {
        const {source, ...baseOpts} = values;
        const layer = new OlImageLayer({
            ...baseOpts,
            source: new OlImageWMSSource(source)
        });
        //add layer to the map
        if(parentLayerGroup)
            parentLayerGroup.getLayers().push(layer);
        else
            map.addLayer(layer);
        //execute onFinish
        onFinish && onFinish();

    },[map, parentLayerGroup, onFinish]);

    return(
        <NewLayerForm 
            layerOpts={layerOpts} 
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

export default NewImageWMSLayerForm;
