import {useCallback} from 'react';
import OlTileLayer from 'ol/layer/Tile';
import OlTileWMSSource from 'ol/source/TileWMS';
import NewLayerForm from '../NewLayerForm/NewLayerForm';
import GeneralTab from '../../tabs/general/GeneralTab/GeneralTab';
import TileWMSSourceTab  from '../../tabs/source/TileWMSSourceTab/TileWMSSourceTab';
import {normalizeStringInObject} from '../../../../../util/common';

const defaultTileWMSLayerOpts = {
    opacity: 1,
    maxResolution: Infinity,
    maxZoom: Infinity,
    minResolution: 0,
    minZoom: -Infinity,
    visible: true,
    zIndex: 0,
    name: 'unnamed layer',
    source: {
        imageSmoothing: true,
        opaque: true,
        wrapX: true,
        hidpi: true,
        gutter: 0,
        params: {
            FORMAT: 'image/png',
            STYLES: '',
            VERSION: '1.1.1',
            FEATURE_COUNT: 50
        }
    }
};

const NewTileWMSLayerForm = ({
    map,
    parentLayerGroup = undefined,
    layerOpts = defaultTileWMSLayerOpts, 
    onFinish = undefined
}) => {

    const onInternalFinish = useCallback((values) => {
        normalizeStringInObject(values);
        normalizeStringInObject(values.source);
        normalizeStringInObject(values.source.params);
        const {source, ...baseOpts} = values;
        
        const layer = new OlTileLayer({
            ...baseOpts,
            source: new OlTileWMSSource(source)
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
            //GeneralTab={GeneralTab}
            //SourceTab={ImageWMSSourceTab}
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
                    el: TileWMSSourceTab
                }
            ]}
            
        />
    );
};

export default NewTileWMSLayerForm;
