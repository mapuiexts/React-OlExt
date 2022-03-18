import {useCallback} from 'react';
import OlTileLayer from "ol/layer/Tile";
import OlOSMSource from 'ol/source/OSM';
import NewLayerForm from '../NewLayerForm/NewLayerForm';
import GeneralTab from '../../tabs/general/GeneralTab/GeneralTab';
import OSMSourceTab  from '../../tabs/source/OSMSourceTab/OSMSourceTab';

const defaultOSMLayerOpts = {
    opacity: 1,
    maxResolution: Infinity,
    maxZoom: Infinity,
    minResolution: 0,
    minZoom: -Infinity,
    visible: true,
    zIndex: 0,
    name: 'OSM',
    source: {
        imageSmoothing: true,
        opaque: true,
        wrapX: true
    }
};

const NewOSMLayerForm = ({
    map,
    parentLayerGroup = undefined,
    layerOpts = defaultOSMLayerOpts, 
    onFinish = undefined
}) => {

    const onInternalFinish = useCallback((values) => {
        const {source, ...baseOpts} = values;
        const opts = {
            ...baseOpts, 
            source: new OlOSMSource(source)
        };
        //create new Group Layer with values from Form
        const layer = new OlTileLayer(opts);
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
            //SourceTab={OSMSourceTab}
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

export default NewOSMLayerForm;
